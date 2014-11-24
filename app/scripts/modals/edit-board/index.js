'use strict';

module.exports = function EditBoardModal(Modal) {
	return Modal({

		/**
		 *
		 */
		template: require('./template.html'),

		/**
		 *
		 */
		controller: function($scope, $http, $location, Config) {
			var host = $location.host();
			var port = $location.port();

			var url = function(id, code) {
				return host + ':' + port + '/board/' + id + '/access/' + code;
			}

			if($scope.result.accessCode) {
				$scope.result.url = url(
					$scope.result.id, $scope.result.accessCode);
			}

			var endpoint = Config.api.url() + '/boards/' + $scope.result.id +
				'/access';

			/**
			 *
			 */
			$scope.generate = function() {
				$http.post(endpoint).then(function(res) {
					$scope.result.url = url(
						$scope.result.id, res.data.accessCode);
					$scope.result.accessCode = res.data.accessCode;
				});
			}

			/**
			 *
			 */
			$scope.clear = function() {
				$http.delete(endpoint).then(function(res) {
					$scope.result.url        = null;
					$scope.result.accessCode = null;
				});
			}
		}
	});
}
