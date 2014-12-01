'use strict';

module.exports = function($scope, $http, $location, Config) {
	var host = $location.host();
	var port = $location.port();

	/**
	 *
	 */
	var _url = function _url(id, code) {
		return host + ':' + port + '/board/' + id + '/access/' + code;
	}

	if($scope.props.accessCode) {
		$scope.url = _url($scope.props.id, $scope.props.accessCode);
	}

	var endpoint = Config.api.url() + '/boards/' + $scope.props.id + '/access';

	/**
	 *
	 */
	$scope.generate = function() {
		$http.post(endpoint).then(function(res) {
			$scope.url = _url($scope.props.id, res.data.accessCode);
			$scope.props.accessCode = res.data.accessCode;
		});
	}

	/**
	 *
	 */
	$scope.clear = function() {
		$http.delete(endpoint).then(function() {
			$scope.url              = null;
			$scope.props.accessCode = null;
		});
	}
}