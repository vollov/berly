var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

var _ = require('underscore');
var cfg = require('../config');
var bunyan = require('bunyan');
var log = bunyan.createLogger(_.extend(cfg.logging, {name: 'lib-passport'}));

passport.use(new LocalStrategy(function(username, password, done) {
	log.debug('passport local strategy find user by username %s', username);
	User.findOne({username : username}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, {
				message : 'Incorrect username.'
			});
		}
		if (!user.validPassword(password)) {
			return done(null, false, {
				message : 'Incorrect password.'
			});
		}
		
		log.debug('passport local strategy user found username= %s', user.username);
		return done(null, user);
	});
}));