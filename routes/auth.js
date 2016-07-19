var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
//var jwt = require('express-jwt');

var _ = require('underscore');
var cfg = require('../config');
var bunyan = require('bunyan');
var log = bunyan.createLogger(_.extend(cfg.logging, {name: 'auth'}));

var User = mongoose.model('User');
//var auth = jwt({secret: cfg.token.secret, userProperty: 'payload'});

router.post('/register', function(req, res, next) {
	if (!req.body.username) {
		return res.status(400).json({
			message : 'username required'
		});
	}
	
	if (!req.body.password) {
		return res.status(400).json({
			message : 'password required'
		});
	}

	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password)

	user.save(function(err) {
		if (err) {
			return next(err);
		}

		return res.json({
			token : user.generateJWT()
		})
	});
});

router.post('/login', function(req, res, next) {
	if (!req.body.username) {
		return res.status(400).json({
			message : 'username required'
		});
	}
	
	if (!req.body.password) {
		return res.status(400).json({
			message : 'password required'
		});
	}

	User.findOne({username : req.body.username}, function(err, user) {
		if (err) {
			return res.status(500).json({
				message : 'login error when find user by username' 
			});
		}
		if (!user) {
			return res.status(401).json({
				message : 'login a non-existing user' 
			});
		}
		if (!user.validPassword(req.body.password)) {
			return res.status(401).json({
				message : 'Incorrect password.' 
			});
		}
		
		return res.status(200).json({
			token : user.generateJWT()
		})
	});
	
//	log.debug('calling passport in auth.login');
//	passport.authenticate('local', function(err, user, info) {
//		if (err) {
//			return next(err);
//		}
//
//		if (user) {
//			log.debug('found user in auth.login..');
//			return res.json({
//				token : user.generateJWT()
//			});
//		} else {
//			log.debug('failed to found user in auth.login');
//			return res.status(401).json(info);
//		}
//	})(req, res, next);
});

module.exports = router;