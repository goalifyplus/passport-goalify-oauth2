var Profile = require('../../lib/profile/goalify')
  , fs = require('fs')


describe('GoalifyProfile.parse', function() {

  xdescribe('profile with plus.login scope only', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/fixtures/goalify/me.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('');
      expect(profile.name.familyName).to.equal('');
      expect(profile.name.givenName).to.equal('');
      expect(profile.emails).to.be.undefined;
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal('https://s3-ap-southeast-1.amazonaws.com/webapp.prod.goalify.plus/5919625966ec61100f8c167e/174541da-7d3b-4d8e-86a3-fb575c3dd5e5.jpeg');
    });
  });

  xdescribe('profile with profile scope', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/fixtures/goalify/me-with-profile.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('test@goalify.plus');
      expect(profile.name.familyName).to.equal('test@goalify.plus');
      expect(profile.name.givenName).to.equal('test@goalify.plus');
      expect(profile.emails).to.be.undefined;
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal('https://s3-ap-southeast-1.amazonaws.com/webapp.prod.goalify.plus/5919625966ec61100f8c167e/174541da-7d3b-4d8e-86a3-fb575c3dd5e5.jpeg');
    });
  });

  describe('profile with profile and email scope', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/fixtures/goalify/me-with-profile-email.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('test@goalify.plus');
      expect(profile.name.familyName).to.equal('test@goalify.plus');
      expect(profile.name.givenName).to.equal('test@goalify.plus');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('test@goalify.plus');
      expect(profile.emails[0].type).to.equal('account');
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal('https://s3-ap-southeast-1.amazonaws.com/webapp.prod.goalify.plus/5919625966ec61100f8c167e/174541da-7d3b-4d8e-86a3-fb575c3dd5e5.jpeg');
    });
  });

  describe('profile without image attribute', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/fixtures/goalify/me-no-image.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('test@goalify.plus');
      expect(profile.name.familyName).to.equal('test@goalify.plus');
      expect(profile.name.givenName).to.equal('test@goalify.plus');
      expect(profile.emails).to.be.undefined;
      expect(profile.photos).to.be.undefined;
    });
  });

});