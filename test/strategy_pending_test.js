/* global describe, it, expect */
/* jshint expr: true */

var GoalifyStrategy = require('../lib/strategy')
  , chai = require('chai');


describe('Strategy', function () {

  describe('constructed', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });

    it('should be named google', function () {
      expect(strategy.name).to.equal('goalify');
    });
  })

  describe('constructed with undefined options', function () {
    it('should throw', function () {
      expect(function () {
        var strategy = new GoalifyStrategy(undefined, function () { });
      }).to.throw(Error);
    });
  })

  xdescribe('authorization request with documented parameters', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });


    var url;

    before(function (done) {
      chai.passport.use(strategy)
        .redirect(function (u) {
          url = u;
          done();
        })
        .req(function (req) {
          req.session = {};
        })
        .authenticate({ prompt: 'select_account', loginHint: 'john@mail.com', accessType: 'offline' });
    });

    it('should be redirected', function () {
      expect(url).to.equal('https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=select_account&login_hint=john%40mail.com&response_type=code&client_id=ABC123');
    });
  }); // authorization request with documented parameters

  xdescribe('authorization request with documented parameters from OpenID Connect', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });


    var url;

    before(function (done) {
      chai.passport.use(strategy)
        .redirect(function (u) {
          url = u;
          done();
        })
        .req(function (req) {
          req.session = {};
        })
        .authenticate({ display: 'touch' });
    });

    it('should be redirected', function () {
      expect(url).to.equal('https://accounts.google.com/o/oauth2/v2/auth?display=touch&response_type=code&client_id=ABC123');
    });
  }); // authorization request with documented parameters from OpenID Connect

  xdescribe('authorization request with incremental authorization parameters', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });


    var url;

    before(function (done) {
      chai.passport.use(strategy)
        .redirect(function (u) {
          url = u;
          done();
        })
        .req(function (req) {
          req.session = {};
        })
        .authenticate({ scope: ['https://www.googleapis.com/auth/drive.file'], includeGrantedScopes: true });
    });

    it('should be redirected', function () {
      expect(url).to.equal('https://accounts.google.com/o/oauth2/v2/auth?include_granted_scopes=true&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&client_id=ABC123');
    });
  }); // authorization request with incremental authorization parameters

  xdescribe('authorization request with Goalify Apps for Work parameters', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });


    var url;

    before(function (done) {
      chai.passport.use(strategy)
        .redirect(function (u) {
          url = u;
          done();
        })
        .req(function (req) {
          req.session = {};
        })
        .authenticate({ hostedDomain: 'mycollege.edu' });
    });

    it('should be redirected', function () {
      expect(url).to.equal('https://accounts.google.com/o/oauth2/v2/auth?hd=mycollege.edu&response_type=code&client_id=ABC123');
    });
  }); // authorization request with Goalify Apps for Work parameters

  xdescribe('authorization request with Goalify Apps for Work parameters, in abbreviated form', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });


    var url;

    before(function (done) {
      chai.passport.use(strategy)
        .redirect(function (u) {
          url = u;
          done();
        })
        .req(function (req) {
          req.session = {};
        })
        .authenticate({ hd: 'mycollege.edu' });
    });

    it('should be redirected', function () {
      expect(url).to.equal('https://accounts.google.com/o/oauth2/v2/auth?hd=mycollege.edu&response_type=code&client_id=ABC123');
    });
  }); // authorization request with Goalify Apps for Work parameters, in abbreviated form

  xdescribe('authorization request with Goalify parameters', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });


    var url;

    before(function (done) {
      chai.passport.use(strategy)
        .redirect(function (u) {
          url = u;
          done();
        })
        .req(function (req) {
          req.session = {};
        })
        .authenticate({ requestVisibleActions: 'http://schema.org/AddAction http://schema.org/ReviewAction' });
    });

    it('should be redirected', function () {
      expect(url).to.equal('https://accounts.google.com/o/oauth2/v2/auth?request_visible_actions=http%3A%2F%2Fschema.org%2FAddAction%20http%3A%2F%2Fschema.org%2FReviewAction&response_type=code&client_id=ABC123');
    });
  }); // authorization request with Goalify parameters

  xdescribe('authorization request with OpenID 2.0 migration parameters', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });


    var url;

    before(function (done) {
      chai.passport.use(strategy)
        .redirect(function (u) {
          url = u;
          done();
        })
        .req(function (req) {
          req.session = {};
        })
        .authenticate({ openIDRealm: 'http://www.example.com/' });
    });

    it('should be redirected', function () {
      expect(url).to.equal('https://accounts.google.com/o/oauth2/v2/auth?openid.realm=http%3A%2F%2Fwww.example.com%2F&response_type=code&client_id=ABC123');
    });
  }); // authorization request with OpenID 2.0 migration parameters

  xdescribe('authorization request with undocumented parameters', function () {
    var strategy = new GoalifyStrategy({
      clientID: 'abc123',
      clientSecret: 'ssh-secret'
    }, function () { });


    var url;

    before(function (done) {
      chai.passport.use(strategy)
        .redirect(function (u) {
          url = u;
          done();
        })
        .req(function (req) {
          req.session = {};
        })
        .authenticate({ approvalPrompt: 'force', userID: 'bob@gmail.com' });
    });

    it('should be redirected', function () {
      expect(url).to.equal('https://accounts.google.com/o/oauth2/v2/auth?approval_prompt=force&user_id=bob%40gmail.com&response_type=code&client_id=ABC123');
    });
  }); // authorization request with undocumented parameters

});