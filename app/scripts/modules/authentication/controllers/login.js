'use strict';


module.exports = function($scope, $state, Config, authService) {

	$scope.user   = { }
	$scope.errors = { }

	$scope.login = function(form) {
		$scope.submitted = true;

		if(form.$valid) {
			authService.login($scope.user).then(
				function() {
					$state.go(Config.states.main);
				},
				function(err) {
					$scope.errors.other = err.data.message;
				});
		}
	}
}
