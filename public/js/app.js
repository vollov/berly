'use strict';

//{headers: {Authorization: 'Bearer '+authService.getToken()}}

angular.module('berylApp', ['ui.router', 'auth', 'message'])
.constant('API', 'http://localhost:8000')
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
	$stateProvider.state('home', {
		url : '/home',
		templateUrl : '/views/home.html'
		//controller : 'MainCtrl'
	}).state('pofile', {
		url : '/profile',
		templateUrl : '/views/profile.html',
		controller : 'MessageCtrl',
		resolve: {
			postPromise: ['messageService', function(messageService){
				return messageService.getAll();
			}]
		}
	}).state('users', {
		url : '/users',
		templateUrl : '/views/users.html'
		//controller : 'PostsCtrl'
	}).state('about', {
		url : '/about',
		templateUrl : '/views/about.html',
		controller : 'MessageCtrl'
		//controller : 'PostsCtrl'
	}).state('login', {
		url : '/login',
		templateUrl : '/views/login.html',
		controller : 'AuthCtrl',
		onEnter : [ '$state', 'authService', function($state, authService) {
			if (authService.isLoggedIn()) {
				$state.go('home');
			}
		} ]
	});
//	.state('register', {
//		url : '/register',
//		templateUrl : '/views/register.html',
//		controller : 'AuthCtrl',
//		onEnter : [ '$state', 'authService', function($state, authService) {
//			if (authService.isLoggedIn()) {
//				$state.go('home');
//			}
//		}]
//	});
	
	$httpProvider.interceptors.push('authInterceptor');
	
	$urlRouterProvider.otherwise('home');
}]);

