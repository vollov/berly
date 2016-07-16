'use strict';


angular.module('berylApp', ['ui.router', 'auth', 'message'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url : '/home',
		templateUrl : '/views/home.html',
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
		templateUrl : '/views/users.html',
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
	})
	.state('register', {
		url : '/register',
		templateUrl : '/views/register.html',
		controller : 'AuthCtrl',
		onEnter : [ '$state', 'authService', function($state, authService) {
			if (authService.isLoggedIn()) {
				$state.go('home');
			}
		}]
	});
	
	$urlRouterProvider.otherwise('home');
}]);


				
//app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
//	$scope.test = 'Hello world!';
//	$scope.posts = posts.posts;
//
//	$scope.posts = [ {
//		title : 'post 1',
//		upvotes : 5
//	}, {
//		title : 'post 2',
//		upvotes : 2
//	}, {
//		title : 'post 3',
//		upvotes : 15
//	}, {
//		title : 'post 4',
//		upvotes : 9
//	}, {
//		title : 'post 5',
//		upvotes : 4
//	} ];
//
//	$scope.addPost = function() {
//		if (!$scope.title || $scope.title === '') {
//			return;
//		}
//		$scope.posts.push({
//			title : $scope.title,
//			link : $scope.link,
//			upvotes : 0,
//			comments : [ {
//				author : 'Joe',
//				body : 'Cool post!',
//				upvotes : 0
//			}, {
//				author : 'Bob',
//				body : 'Great idea but everything is wrong!',
//				upvotes : 0
//			} ]
//		});
//		$scope.title = '';
//		$scope.link = '';
//	};
//
//			$scope.incrementUpvotes = function(post) {
//				post.upvotes += 1;
//			};
//		} ]);
//
//app.controller('PostsCtrl', ['$scope', '$stateParams', 'posts',
//	function($scope, $stateParams, posts) {
//	
//		$scope.post = posts.posts[$stateParams.id];
//	
//		$scope.addComment = function(){
//			if($scope.body === '') { return; }
//			
//			$scope.post.comments.push({
//				body : $scope.body,
//				author : 'user',
//				upvotes : 0});
//						
//			$scope.body = '';
//		};
//}]);
//
//app.factory('posts', [ function() {
//	var o = {
//		posts : []
//	};
//	return o;
//}]);
