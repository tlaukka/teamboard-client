'use strict';


module.exports = function($scope, $state, $translate, Config, authService) {

	$scope.user   = { }
	$scope.errors = { }

	$scope.register = function(form) {
		$scope.submitted = true;

		if(form.$valid) {
			if ($scope.user.password === $scope.user.passwordConfirm) {
				authService.register($scope.user).then(
					function() {
						$state.go(Config.states.login);
					},
					function(err) {
						$scope.errors.other = err.data.message;
					});
			}
			else {
				// Password mismatch
				$translate('AUTH_MESSAGE_PWCONFIRMERROR').then(function(message) {
					$scope.errors.other = message;
					$scope.user.password = '';
					$scope.user.passwordConfirm = '';
				});
			}
		}
		else {
			// Invalid email
			$translate('AUTH_MESSAGE_EMAILERROR').then(function(message) {
				$scope.errors.other = message;
				$scope.user.email = '';
			});
		}
	}
}
