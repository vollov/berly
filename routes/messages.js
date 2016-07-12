var mongoose = require('mongoose');
var Message = mongoose.model('Message');

var Logger = require('../lib/logger.js');
var logger = Logger().getLogger();

var express = require('express');
var router = express.Router();
//var jwt = require('express-jwt');
//var cfg = require('../config');
//var auth = jwt({secret: cfg.secret, userProperty: 'payload'});

/**
 * get all messages
 */
router.get('/messages', function(req, res, next) {
	Message.find(function(err, messages) {
		if (err) {
			return next(err);
		}

		res.json(messages);
	});
});

/**
 * create new message
 */
router.post('/messages', function(req, res, next) {
	var message = new Message(req.body);
	//message.author = req.payload.username;

	message.save(function(err, message) {
		if (err) {
			return next(err);
		}

		res.json(message);
	});
});

router.param('message', function(req, res, next, id) {
	var query = Message.findById(id);

	logger.debug('entering router.param->message, id=' + id);
	query.exec(function(err, message) {
		if (err) {
			return next(err);
		}
		if (!message) {
			return next(new Error("can't find message"));
		}

		req.message = message;
		return next();
	});
});

router.get('/messages/:message', function(req, res, next) {
	logger.debug('entering /messages/:message');
	res.json(req.message);
});

module.exports = router;