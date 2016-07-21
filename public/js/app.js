'use strict';

//{headers: {Authorization: 'Bearer '+authService.getToken()}}

angular.module('berylApp', ['ui.router', 'auth', 'message'])
.constant('API', '/api/v1.0/')
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
	$stateProvider.state('home', {
		url : '/home',
		templateUrl : '/views/home.html',
		data:{
			requireLogin: false
		}
		//controller : 'MainCtrl'
	}).state('pofile', {
		url : '/profile',
		templateUrl : '/views/profile.html',
		controller : 'MessageCtrl',
		resolve: {
			postPromise: ['messageService', function(messageService){
				return messageService.getAll();
			}]
		},
		data:{
			requireLogin: true
		}
	}).state('users', {
		url : '/users',
		templateUrl : '/views/users.html',
		data:{
			requireLogin: true
		}
		//controller : 'PostsCtrl'
	}).state('about', {
		url : '/about',
		templateUrl : '/views/about.html',
		controller : 'MessageCtrl',
		data:{
			requireLogin: false
		}
		//controller : 'PostsCtrl'
	}).state('login', {
		url : '/login',
		templateUrl : '/views/login.html',
		controller : 'AuthCtrl',
		onEnter : [ '$state', 'authService', function($state, authService) {
			if (authService.isLoggedIn()) {
				$state.go('home');
			}
		} ],
		data:{
			requireLogin: false
		}
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
}])
.run(function ($rootScope,$state,authService) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
		var requireLogin = toState.data.requireLogin;
		console.log('state change event, isLoggedIn=%s',authService.isLoggedIn());
		// typeof $rootScope.currentUser === 'undefined'
		if (requireLogin && (!authService.isLoggedIn())) {
			event.preventDefault();
			// code for unauthorized access
			console.log('state change event -- unauthorized');
			$state.go('login');
		}
	});

});
