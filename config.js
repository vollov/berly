'use strict';
var path = require('path');

module.exports = {
	
	logging: {
		name: 'berly',
		streams : [ {
			level : 'debug',
			type : 'rotating-file',
			path : path.join('.', 'logs/server.log'),
			period : '1d', // daily rotation
			count : 3 // keep 3 back copies
		} ]
	},
	
	test_log: {
		name: 'berly',
		streams : [ {
			level : 'debug',
			type : 'rotating-file',
			path : path.join('.', 'logs/test.log'),
			period : '1d', // daily rotation
			count : 3 // keep 3 back copies
		} ]
	},
		
	test:{
		url : 'http://localhost:8000'
	},
	test_db:{
		host: 'localhost',
		name: 'beryl_test',
		port: '27017',
	},
	port:8000,
	token:{
		secret: 'uwotm8xxc',
		exp_in_days: 14, // token expire in 14 days
		age: 20 *60 * 1000 // 20 minutes in ms
	},
	app:{
		api_url:'/api/v1.0',
		root:'.'
	},
	jwt:{
		secret: 'myusername_hmacsha256',
		algorithm: 'HS256',
		expiresInSeconds: 1800
	},
	db:{
		host: 'localhost',
		name: 'beryl',
		port: '27017',
	},
	
	'secret': 'ilovescotchyscotch',
	'database': 'mongodb://localhost:27017/rest'

};