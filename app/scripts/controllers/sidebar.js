'use strict';


module.exports = function($scope, $rootScope, $state, $timeout, authService) {

	// Set the initial state
	$scope.isCollapsed = (localStorage.getItem('tb-sidebar-collapsed') === 'true');
	$timeout(function() {
		$rootScope.$broadcast('action:sidebar-collapse', $scope.isCollapsed);
	}, 0);

	authService.getUser().then(function(user) {
		$scope.currentUser = user;
	});

	$scope.logout = function() {
		authService.logout().then(function() {
			$state.go('login');
		});
	}

	$scope.toggleCollapse = function() {
		$scope.isCollapsed = !$scope.isCollapsed;
		localStorage.setItem('tb-sidebar-collapsed', $scope.isCollapsed.toString());
		$rootScope.$broadcast('action:sidebar-collapse', $scope.isCollapsed);
	}
}
