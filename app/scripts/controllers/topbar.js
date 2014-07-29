'use strict';


module.exports = function($scope, $rootScope) {

	$scope.snapEnabled = false;
	$scope.removeEnabled = false;
	$scope.editEnabled = false;

	$scope.onCreateClicked = function() {
		$rootScope.$broadcast('action:create');
	}

	// $scope.onCreateTicketClicked = function() {
	// 	$rootScope.$broadcast('action:create-ticket');
	// }

	$scope.onEnableSnapClicked = function() {
		$rootScope.$broadcast('action:enable-snap');
	}

	$scope.onZoomOutClicked = function() {
		$rootScope.$broadcast('action:zoom-out');
	}

	$scope.onRemoveClicked = function() {
		$rootScope.$broadcast('action:remove');
	}

	$scope.onEditClicked = function() {
		$rootScope.$broadcast('action:edit');
	}

	$scope.$on('ui:enable-remove', function(event, enabled) {
		$scope.removeEnabled = enabled;
	});

	$scope.$on('ui:enable-edit', function(event, enabled) {
		$scope.editEnabled = enabled;
	});
}
