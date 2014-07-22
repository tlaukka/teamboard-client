'use strict';


module.exports = function($timeout, $document, scrollArea) {

	var IScroll = require('IScroll');

	return {
		restrict: 'A',
		scope: {},

		link: function(scope, element) {

			// var scroll = new IScroll(element[0], {
			scrollArea.scroll = new IScroll(element[0], {
				scrollX: true,
				scrollY: true,
				freeScroll: true,
				mouseWheel: true,
				scrollbars: true,
				interactiveScrollbars: true,
				disableMouse: true
			});

			// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		}
	};
}
