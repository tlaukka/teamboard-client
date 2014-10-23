'use strict';


module.exports = function($scope, $rootScope, resolvedBoard) {

	$scope.board = resolvedBoard;
	$scope.isSidebarCollapsed = (localStorage.getItem('tb-sidebar-collapsed') === 'true');

	$scope.snapEnabled = false;
	$scope.removeEnabled = false;
	$scope.editEnabled = false;
	$scope.backgroundEnabled = false;

	$scope.onCreateClicked = function() {
		$rootScope.$broadcast('action:create');
	}

	$scope.onAddBackgroundClicked = function() {
		$rootScope.$broadcast('action:add-background');
	}

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

	$scope.onHeadingClicked = function() {
		$rootScope.$broadcast('action:edit-board');
	}

	$scope.$on('ui:enable-remove', function(event, enabled) {
		$scope.removeEnabled = enabled;
	});

	$scope.$on('ui:enable-edit', function(event, enabled) {
		$scope.editEnabled = enabled;
	});

	$scope.$on('ui:enable-background', function(event, enabled) {
		$scope.backgroundEnabled = enabled;
	});

	$scope.$on('action:sidebar-collapse', function(event, isCollapsed) {
		$scope.isSidebarCollapsed = isCollapsed;
	});
}
