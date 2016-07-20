var mongoose = require('mongoose');
var Message = mongoose.model('Message');

var _ = require('underscore');
var cfg = require('../config');
var bunyan = require('bunyan');
var log = bunyan.createLogger(_.extend(cfg.logging, {name: 'route-messages'}));

var express = require('express');
var router = express.Router();

var expressJwt = require('express-jwt');
var jwtauth = expressJwt({secret: cfg.token.secret, userProperty: cfg.token.user_property});

router.get('/cat', function(req, res, next) {
	log.debug('HTTP GET /cat -- all message');
	return res.status(200).json('calling get cat');
	});

/**
 * Only authenticated user can call api to get all messages
 */
router.get('/', jwtauth, function(req, res, next) {

	log.debug('HTTP GET /messages -- all message, req =');
	//res.status(200).json('calling get all messages');
	Message.find({}).select('id_ title content').exec(function(err, messages) {
		if (err) {
			log.debug('HTTP GET /messages -- all message, err = %j', err);
			return res.status(500).json(err);
			//return next(err);
		}
		//console.log(messages);
		return res.status(200).json(messages);
	});
});

/**
 * create new message
 */
router.post('/', function(req, res, next) {
	log.debug('POST message= %j', req.body);
	var message = new Message(req.body);
	//message.author = req.payload.username;

	message.save(function(err, message) {
		if (err) {
			return next(err);
		}

		log.debug('saved message with id = ' + message.id)
		res.json(message);
	});
});

router.get('/:id', function(req, res, next) {
	var id = req.params.id;	
	log.debug('HTTP GET /messages/:id -- id = %s', id);
	
	var query = Message.findById(id);

	query.exec(function(err, message) {
		if (err) {
			return next(err);
		}
		if (!message) {
			return next(new Error("can't find message"));
		}
		
		log.debug('GET by id message= %j', message);
		res.json(message);
	});
});

router.delete('/:id', function(req, res, next){
	var id = req.params.id;
	var query = Message.findById(id).remove();
	
	query.exec(function(err, message) {
		if (err) {
			return next(err);
		}
		if (!message) {
			return next(new Error("can't find message"));
		}
		
		log.debug('DELETE by id message= %j', message);
		res.json(message);
	});
});

router.put('/:id', function(req, res, next) {
	var id = req.params.id;
	var body = req.body;
	
	log.debug('calling put body =%j', body);
	
	Message.findById(id, function(err, message){
		
		log.debug('find message in put id=%s, err =%j, msg = %j', id, err, message);
		
		if (err) {
			return next(err);
		}
		if (!message) {
			log.debug('find message id =%s failure', id);
			res.status(404).json({
				message: 'Message with id ' + id + ' can not be found.'
			});
			//return next(new Error("can't find message"));
		}
		
		message.update(body, function(error, status) {
			
			log.debug('updated status=%j', status);
			
			if(error) return next(error);
			res.json(status);
		});
	});
});

module.exports = router;