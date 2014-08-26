'use strict';


module.exports = function() {
	return {
		restrict: 'E',
		template: require('../../partials/bgpreview.html'),
		replace: true,

		scope: {
			name: '@',
			imageUrl: '@',
			selectedBg: '='
		},

		link: function(scope, element) {

			scope.isSelected = false;

			scope.onBackgroundClicked = function($event) {
				$event.stopPropagation();
				scope.toggleSelection();
			}

			scope.toggleSelection = function() {
				if (element.hasClass('selected')) {
					element.removeClass('selected');
				}
				else {
					element.addClass('selected');
				}

				scope.selectedBg = scope.imageUrl;
			}
		}
	};
}
