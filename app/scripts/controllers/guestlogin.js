'use strict';


module.exports = function($scope, $state, $stateParams, $http, Config, authService) {
	$scope.username = '';

	$scope.login = function(form) {
		$scope.submitted = true;

		if (form.$valid) {
			authService.loginGuest($stateParams.id, $stateParams.code, $scope.username).then(
				function() {
					console.log('för helvete');
					$state.go('main.board.guest', { id: $stateParams.id });
				},
				function(err) {
					$scope.errors.other = err.data.message;
				});
		}
	}
}
