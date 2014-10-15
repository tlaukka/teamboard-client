'use strict';


module.exports = function($scope, $stateParams, $http, Config) {
	console.debug($stateParams.id);
	console.debug($stateParams.code);

	$scope.login = function() {
		return $http.post(api + '/boards/' + $stateParams.id + '/access/' + $stateParams.code)
				.then(function(response) {
					var token = response.headers('x-access-token');
					localStorage.setItem(Config.tokenKey, token);
				});
	}
}
