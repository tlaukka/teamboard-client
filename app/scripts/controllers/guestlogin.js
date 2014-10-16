'use strict';


module.exports = function($scope, $state, $stateParams, $http, Config, authService) {
	$scope.username = '';

	$scope.login = function(form) {
		$scope.submitted = true;

		if (form.$valid) {
			var url = Config.api.url() + 'boards/' + $stateParams.id + '/access/' + $stateParams.code;

			return $http.post(url, { username: $scope.username }).then(
				function(response) {
					var token = response.headers('x-access-token');
					authService.setToken(token);
					$state.go('main.board', { id: $stateParams.id });
				},
				function(err) {
					$scope.errors.other = err.data.message;
				});
		}
	}
}
