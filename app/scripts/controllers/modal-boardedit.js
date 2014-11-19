'use strict';


var _ = require('lodash');

module.exports = function($scope, $modalInstance, $location, boardCollection) {

	$scope.board = boardCollection.getSelectedBoard();
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

	$scope.copyUrlFallback = function(copy) {
		window.prompt('Press cmd+c to copy the text below.', copy);
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
