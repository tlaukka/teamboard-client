'use strict';

module.exports = function CreateBoardModal(Modal) {
	return Modal({
		template: require('./template.html'),

		/**
		 *
		 */
		controller: function($scope) {
			$scope.result      = $scope.result || { }
			$scope.result.name = $scope.result.name || '';
		}
	});
}
