var mongoose = require('mongoose');
var Message = mongoose.model('Message');

var _ = require('underscore');
var cfg = require('../config');
var bunyan = require('bunyan');
var log = bunyan.createLogger(_.extend(cfg.logging, {name: 'route-messages'}));

var express = require('express');
var router = express.Router();

var expressJwt = require('express-jwt');
var jwtauth = expressJwt({secret: cfg.secret, userProperty: 'payload'});

router.get('/cat', function(req, res, next) {
	log.debug('HTTP GET /cat -- all message');
	res.status(200).json('calling get cat');
	});

/**
 * Only authenticated user can call api to get all messages
 */
router.get('/messages', jwtauth, function(req, res, next) {

	log.debug('HTTP GET /messages -- all message, req =');
	//res.status(200).json('calling get all messages');
	Message.find({}).select('id_ title content').exec(function(err, messages) {
		if (err) {
			log.debug('HTTP GET /messages -- all message, err = %j', err);
			res.json(err);
			//return next(err);
		}
		//console.log(messages);
		res.json('hello');
	});
});

/**
 * create new message
 */
router.post('/messages', function(req, res, next) {
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

router.get('/messages/:id', function(req, res, next) {
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

router.delete('/messages/:id', function(req, res, next){
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

router.put('/messages/:id', function(req, res, next) {
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