'use strict';


module.exports = function($scope, $state, authService) {

	$scope.isCollapsed = false;

	authService.getUser().then(function(user) {
		$scope.currentUser = user;
	});

	$scope.logout = function() {
		authService.logout().then(function() {
			$state.go('login');
		});
	}
}
