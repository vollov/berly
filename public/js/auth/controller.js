'use strict';

angular.module('auth.controllers', [ 'auth.services', 'ui.router'])
.controller('NavCtrl', ['$scope', 'authService',
function($scope, authService) {
	$scope.isLoggedIn = authService.isLoggedIn;
	$scope.currentUser = authService.currentUser;
	$scope.logOut = authService.logOut;
}]).controller('AuthCtrl', ['$scope', '$state', 'authService',
function($scope, $state, authService) {
	$scope.user = {};

	$scope.register = function() {
		authService.register($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};

	$scope.logIn = function() {
		authService.logIn($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('users');
		});
	};
}]);