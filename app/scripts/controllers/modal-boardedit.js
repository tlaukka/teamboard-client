'use strict';


var _ = require('underscore');

module.exports = function($scope, $modalInstance, $http, $location, Config, Board) {

	$scope.board = Board.selectedBoard;
	$scope.url = '';

	if ($scope.board.accessCode != undefined) {
		var host = $location.host();
		var port = $location.port();
		$scope.url = host + ':' + port + '/board/' + $scope.board.id + '/access/' + $scope.board.accessCode;
	}

	$scope.generateUrl = function() {
		$scope.board.grantGuestAccess().then(function() {
			var host = $location.host();
			var port = $location.port();
			$scope.url = host + ':' + port + '/board/' + $scope.board.id + '/access/' + $scope.board.accessCode;
		});
	}

	$scope.clearUrl = function() {
		$scope.board.revokeGuestAccess().then(function() {
			$scope.board.accessCode = undefined;
			$scope.url = '';
		});
	}

	// Apply action
	$scope.apply = function(result) {
		$modalInstance.close(result);
	}

	// Cancel action
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
}
