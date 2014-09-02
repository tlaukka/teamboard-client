'use strict';


module.exports = function($timeout, $document, scrollArea) {
	return {
		restrict: 'A',
		scope: {},

		link: function(scope, element) {

			scope.$on('action:sidebar-collapse', function(event, isCollapsed) {
				if (isCollapsed) {
					element.addClass('scrollarea-expanded');
				}
				else {
					element.removeClass('scrollarea-expanded');
				}

				scrollArea.refresh(0);
			});

			// Prevent the whole window from scrolling
			document.addEventListener('touchmove', function (event) {
				event.preventDefault();
			}, false);
		}
	};
}
