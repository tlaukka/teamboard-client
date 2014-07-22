'use strict';


module.exports = function($scope, $state, Config, authService) {

	$scope.user   = { }
	$scope.errors = { }

	$scope.register = function(form) {
		$scope.submitted = true;

		if(form.$valid) {
			authService.register($scope.user)
				.then(
					function() {
						$state.go(Config.states.login);
					},
					function(err) {
						$scope.errors.other = err.data.message;
					});
		}
	}
}
