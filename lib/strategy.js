// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , uri = require('url')
  , GoalifyProfile = require('./profile/goalify')
  // TODO goalify does not support openid at the moment
  // , OpenIDProfile = require('./profile/openid')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , GoalifyAPIError = require('./errors/goalify-api-error')
  , UserInfoError = require('./errors/userinfoerror');


/**
 * `Strategy` constructor.
 *
 * The Goalify authentication strategy authenticates requests by delegating to
 * Goalify using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Goalify application's client id
 *   - `clientSecret`  your Goalify application's client secret
 *   - `callbackURL`   URL to which Goalify will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new GoalifyStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/google/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'http://localhost:3030/oauth/authorize';
  options.tokenURL = options.tokenURL || 'http://localhost:3030/oauth/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'goalify';
  this._userProfileURL = options.userProfileURL || 'http://localhost:3030/api/userinfo';

  var url = uri.parse(this._userProfileURL);
  if (url.pathname.indexOf('/userinfo') == (url.pathname.length - '/userinfo'.length)) {
    // TODO pay attention to this
    this._userProfileFormat = 'openid';
  } else {
    this._userProfileFormat = 'goalify'; // Goalify Sign-In
  }
  // TODO hardcode _userProfileFormat = 'goalify';
  this._userProfileFormat = 'goalify';
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Google.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `google`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }

      if (json && json.error && json.error.message) {
        return done(new GoalifyAPIError(json.error.message, json.error.code));
      } else if (json && json.error && json.error_description) {
        return done(new UserInfoError(json.error_description, json.error));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile;
    switch (self._userProfileFormat) {
      //TODO goalify does not support openid at the moment
    /* case 'openid':
      profile = OpenIDProfile.parse(json);
      break; */
    default: // Goalify Sign-In
      profile = GoalifyProfile.parse(json);
      break;
    }

    profile.provider  = 'goalify';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
}

/**
 * Return extra Google-specific parameters to be included in the authorization
 * request.
 *
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function(options) {
  var params = {};

  // https://developers.goalify.plus/identity/protocols/OAuth2WebServer
  if (options.accessType) {
    params['access_type'] = options.accessType;
  }
  if (options.prompt) {
    params['prompt'] = options.prompt;
  }
  if (options.loginHint) {
    params['login_hint'] = options.loginHint;
  }
  if (options.includeGrantedScopes) {
    params['include_granted_scopes'] = true;
  }

  // Undocumented
  if (options.approvalPrompt) {
    params['approval_prompt'] = options.approvalPrompt;
  }
  if (options.userID) {
    // Undocumented, but supported by Goalify's OAuth 2.0 endpoint.  Appears to
    // be equivalent to `login_hint`.
    params['user_id'] = options.userID;
  }

  return params;
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
