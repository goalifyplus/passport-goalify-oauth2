/* global describe, it, before, expect */
/* jshint expr: true */

var GoalifyStrategy = require('../lib/strategy');

const urlForMeProfile = 'http://localhost:3030/api/me';
const urlForUserProfile = 'http://localhost:3030/api/userinfo';

describe('Strategy#userProfile', function() {

  describe('fetched from Goalify API', function() {
    var strategy = new GoalifyStrategy({
        clientID: 'abc123',
        clientSecret: 'ssh-secret'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {

      if (url !== urlForUserProfile) {
        return callback(new Error('incorrect url argument'));
      }

      if (accessToken !== 'token') {
        return callback(new Error('incorrect token argument'));
      }

      var body = `{
  "_id": "111111111111111111111",
  "companyId": "5919625966ec61100f8c167e",
  "birthday": "16-Oct-1985",
  "relationshipStatus": "Single",
  "email": "test@goalify.plus",
  "firstName": "tester",
  "lastName": "goalify",
  "fullname": "tester goalify",
  "gender": "Male",
  "phone": "0903382068",
  "username": "test@goalify.plus",
  "avatar": "https://s3-ap-southeast-1.amazonaws.com/webapp.prod.goalify.plus/5919625966ec61100f8c167e/174541da-7d3b-4d8e-86a3-fb575c3dd5e5.jpeg"
}`;
      callback(null, body, undefined);
    };


    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('goalify');

      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('test@goalify.plus');
      expect(profile.name.familyName).to.equal('test@goalify.plus');
      expect(profile.name.givenName).to.equal('test@goalify.plus');
      expect(profile.emails[0].value).to.equal('test@goalify.plus');
      expect(profile.emails[0].type).to.equal('account');
      expect(profile.photos[0].value).to.equal('https://s3-ap-southeast-1.amazonaws.com/webapp.prod.goalify.plus/5919625966ec61100f8c167e/174541da-7d3b-4d8e-86a3-fb575c3dd5e5.jpeg');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  // TODO check this test case later
  xdescribe('fetched from OpenID Connect user info endpoint', function() {
    var strategy = new GoalifyStrategy({
        clientID: 'abc123',
        clientSecret: 'ssh-secret',
        userProfileURL: urlForUserProfile,
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != urlForUserProfile) {
        return callback(new Error('incorrect url argument'));
      }
      if (accessToken != 'token') {
        return callback(new Error('incorrect token argument'));
      }

      var body = '{\n "sub": "111111111111111111111",\n "name": "test@goalify.plus",\n "given_name": "test@goalify.plus",\n "family_name": "test@goalify.plus",\n "picture": "https://s3-ap-southeast-1.amazonaws.com/webapp.prod.goalify.plus/5919625966ec61100f8c167e/174541da-7d3b-4d8e-86a3-fb575c3dd5e5.jpeg",\n "email": "test@goalify.plus",\n "email_verified": true,\n "locale": "en"\n}\n';
      callback(null, body, undefined);
    };


    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('goalify');

      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('test@goalify.plus');
      expect(profile.name.familyName).to.equal('test@goalify.plus');
      expect(profile.name.givenName).to.equal('test@goalify.plus');
      expect(profile.emails[0].value).to.equal('test@goalify.plus');
      expect(profile.emails[0].verified).to.equal(true);
      expect(profile.photos[0].value).to.equal('https://s3-ap-southeast-1.amazonaws.com/webapp.prod.goalify.plus/5919625966ec61100f8c167e/174541da-7d3b-4d8e-86a3-fb575c3dd5e5.jpeg');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });

  describe('error caused by invalid token when using Goalify API', function() {
    var strategy = new GoalifyStrategy({
        clientID: 'abc123',
        clientSecret: 'ssh-secret'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != urlForUserProfile) { return callback(new Error('incorrect url argument')); }

      var body = '{\n "error": {\n  "errors": [\n   {\n    "domain": "global",\n    "reason": "authError",\n    "message": "Invalid Credentials",\n    "locationType": "header",\n    "location": "Authorization"\n   }\n  ],\n  "code": 401,\n  "message": "Invalid Credentials"\n }\n}\n';
      callback({ statusCode: 401, data: body });
    };

    var err, profile;

    before(function(done) {
      strategy.userProfile('invalid-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      console.log('should error');
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('GoalifyAPIError');
      expect(err.message).to.equal("Invalid Credentials");
      expect(err.code).to.equal(401);
    });
  }); // error caused by invalid token when using Goalify API

  describe('error caused by invalid token when using user info endpoint', function() {
    var strategy = new GoalifyStrategy({
        clientID: 'abc123',
        clientSecret: 'ssh-secret'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != urlForUserProfile) { return callback(new Error('incorrect url argument')); }

      var body = '{\n "error": "invalid_request",\n "error_description": "Invalid Credentials"\n}\n';
      callback({ statusCode: 401, data: body });
    };

    var err, profile;

    before(function(done) {
      strategy.userProfile('invalid-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('UserInfoError');
      expect(err.message).to.equal("Invalid Credentials");
      expect(err.code).to.equal('invalid_request');
    });
  }); // error caused by invalid token when using user info endpoint

  describe('error caused by malformed response', function() {
    var strategy =  new GoalifyStrategy({
        clientID: 'abc123',
        clientSecret: 'ssh-secret'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      var body = 'Hello, world.';
      callback(null, body, undefined);
    };


    var err, profile;

    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse user profile');
    });
  }); // error caused by malformed response

  describe('internal error', function() {
    var strategy =  new GoalifyStrategy({
        clientID: 'abc123',
        clientSecret: 'ssh-secret'
      }, function verify(){});

    strategy._oauth2.get = function(url, accessToken, callback) {
      return callback(new Error('something went wrong'));
    }


    var err, profile;

    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
      expect(err.oauthError).to.be.an.instanceOf(Error);
      expect(err.oauthError.message).to.equal('something went wrong');
    });

    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // internal error

});
