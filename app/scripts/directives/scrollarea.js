'use strict';


module.exports = function($timeout, $document, scrollArea) {

	var IScroll = require('IScroll');

	return {
		restrict: 'A',
		scope: {},

		link: function(scope, element) {

			scrollArea.scroll = new IScroll(element[0], {
				scrollX: true,
				scrollY: true,
				freeScroll: true,
				mouseWheel: true,
				scrollbars: true,
				interactiveScrollbars: true,
				disableMouse: false
			});

			scope.$on('action:sidebar-collapse', function(event, isCollapsed) {
				if (isCollapsed) {
					element.addClass('scrollarea-expanded');
				}
				else {
					element.removeClass('scrollarea-expanded');
				}

				scrollArea.refresh();
			});

			// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		}
	};
}
