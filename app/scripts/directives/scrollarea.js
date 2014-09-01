'use strict';


module.exports = function($timeout, $document, scrollArea) {

	var IScroll = require('IScroll');

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

				scrollArea.refresh();
			});

			// Prevent the whole window from scrolling
			document.addEventListener('touchmove', function (event) {
				event.preventDefault();
			}, false);
		}
	};
}
