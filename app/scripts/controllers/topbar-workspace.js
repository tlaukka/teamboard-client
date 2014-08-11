'use strict';


module.exports = function($scope, $rootScope, boards) {

	$scope.boards = boards;
	$scope.isSidebarCollapsed = (localStorage.getItem('tb-sidebar-collapsed') === 'true');

	$scope.removeEnabled = false;
	$scope.editEnabled = false;

	$scope.onCreateClicked = function() {
		$rootScope.$broadcast('action:create');
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

	$scope.$on('action:sidebar-collapse', function(event, isCollapsed) {
		$scope.isSidebarCollapsed = isCollapsed;
	});
}
