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
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({
			message : 'Please fill out all fields'
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
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({
			message : 'Please fill out all fields'
		});
	}

	log.debug('calling passport in auth.login');
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}

		if (user) {
			log.debug('found user in auth.login..');
			return res.json({
				token : user.generateJWT()
			});
		} else {
			log.debug('failed to found user in auth.login');
			return res.status(401).json(info);
		}
	})(req, res, next);
});

module.exports = router;