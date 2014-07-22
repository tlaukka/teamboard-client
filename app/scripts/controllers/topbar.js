'use strict';


module.exports = function($scope, $rootScope) {

	$scope.snapEnabled = false;

	$scope.onCreateBoardClicked = function() {
		$rootScope.$broadcast('workspace:create-board');
	}

	$scope.onCreateTicketClicked = function() {
		$rootScope.$broadcast('board:create-ticket');
	}

	$scope.onEnableSnapClicked = function() {
		$rootScope.$broadcast('board:enable-snap');
	}

	$scope.onZoomOutClicked = function() {
		$rootScope.$broadcast('board:zoom-out');
	}
}
