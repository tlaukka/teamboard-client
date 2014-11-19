'use strict';

module.exports = function EditBoardModal(Modal) {
	var modal = Modal({

		/**
		 *
		 */
		template: require('./template.html'),

		/**
		 *
		 */
		controller: function($scope) {
			console.log('close...');
			$scope.close = modal.close;
		}
	});
	return modal;
}
