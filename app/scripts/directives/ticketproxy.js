'use strict';


module.exports = function(ticketProxy) {

	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');

	return {
		template: '<div></div>',
		scope: {},

		link: function(scope, element) {

			scope.$watch(function() {
				return ticketProxy.isVisible;
			},
			function(isVisible) {
				if (isVisible) {
					element.addClass('visible');
				}
				else {
					element.removeClass('visible');
				}
			});

			scope.$watch(function() {
				return ticketProxy.position;
			},
			function(position) {
				if (ticketProxy.isVisible) {
					TweenLite.to(element, 0, { x: position.x, y: position.y });
				}
			}, true);
		}
	};
}
