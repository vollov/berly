'use strict';

var url = '/api/v1.0/';

angular.module('auth.services', [])
.factory('authService', [ '$http', '$window', function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['beryl-client-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['beryl-client-token'];
	};
	
	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};
	
	auth.register = function(user) {
		return $http.post(url + '/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post(url + '/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('beryl-client-token');
	};
	return auth;
} ])
.factory('authInterceptor', ['authService', 'API', function authInterceptor(authService, API) {
	var interceptor = {};
	
	interceptor.request = function(config) {
		console.log('testInterceptor request');
		var token = authService.getToken();
//		if (config.url.indexOf(API) === 0 && token) {
//			console.log('testInterceptor request --send token = ' + token);
//			config.headers.Authorization = 'Bearer ' + token;
//		}
		return config;
	};
	
	interceptor.response = function(res) {
		console.log('testInterceptor response');
		authService.saveToken('aabbcc');
		return res;
	};
	
	interceptor.responseError= function(res) {
		console.log('testInterceptor responseError');
		return res;
	};
	return interceptor;	
}]);