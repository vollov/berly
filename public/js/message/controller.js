'use strict';

angular.module('message.controllers', [ 'message.services'])
.controller('MessageCtrl', ['$scope', 'messageService',
function($scope, messageService) {
	$scope.messages = messageService.messages;

	$scope.saveMessage = function() {
		if (!$scope.title || $scope.title === '') {
			return;
		}
		messageService.create({
			title : $scope.title,
			content : $scope.content,
		});
		$scope.title = '';
		$scope.content = '';
	};
}]);