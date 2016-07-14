var mongoose = require('mongoose');
var Message = mongoose.model('Message');

var cfg = require('../config');
var bunyan = require('bunyan');
var log = bunyan.createLogger(cfg.logging);

var express = require('express');
var router = express.Router();
//var jwt = require('express-jwt');

//var auth = jwt({secret: cfg.secret, userProperty: 'payload'});

/**
 * get all messages
 */
router.get('/messages', function(req, res, next) {
	console.log('calling GET messages');
	
	log.debug('debug message for messages GET');
	Message.find({}).select('id_ tile content').exec(function(err, messages) {
		if (err) {
			return next(err);
		}
		console.log(messages);
		res.json(messages);
	});
	
//	Message.find({},function(err, messages) {
//		if (err) {
//			return next(err);
//		}
//		console.log(messages);
//		res.json(messages);
//	});
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
		
		message.update(body, function(error, message) {
			
			log.debug('updated msg=%j', message);
			
			if(error) return next(error);
			
			
			res.json(message);
		});
	});
	
	
	
	//res.json('calling put message');

});

router.get('/messages/:message', function(req, res, next) {
	console.log('entering /messages/:message');
	res.json(req.message);
});

module.exports = router;