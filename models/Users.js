var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var cfg = require('../config');
var _ = require('underscore');
var bunyan = require('bunyan');
var log = bunyan.createLogger(_.extend(cfg.logging, {name: 'user'}));

var UserSchema = new mongoose.Schema({
	username : {
		type : String,
		lowercase : true,
		unique : true
	},
	hash : String,
	salt : String
});

UserSchema.methods.generateJWT = function() {
	
	log.debug('user.generateJWT()...');
	// set expiration to 60 days
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + cfg.token.exp_in_days);

	return jwt.sign({
		_id : this._id,
		username : this.username,
		exp : parseInt(exp.getTime() / 1000),
	}, cfg.token.secret);
};

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64)
			.toString('hex');
};

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

mongoose.model('User', UserSchema);