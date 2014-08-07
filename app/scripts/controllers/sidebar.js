'use strict';


module.exports = function($scope, $rootScope, $state, authService) {

	$scope.isCollapsed = false;

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
		$rootScope.$broadcast('action:sidebar-collapse', $scope.isCollapsed);
	}
}
