'use strict';


module.exports = function($window, $timeout, scrollArea) {

	return {
		template: require('../../partials/minimap.html'),
		restrict: 'E',
		replace: true,

		scope: {
			tickets: "="
		},

		link: function(scope, element) {

			$timeout(function() {
				console.log('minimap');
				scrollArea.destroy();

				scrollArea.scroll = new IScroll('#content-scrollarea', {
					scrollX: true,
					scrollY: true,
					freeScroll: true,
					mouseWheel: true,
					scrollbars: true,
					interactiveScrollbars: true,
					disableMouse: false,
					indicators: {
						el: '#minimap',
						interactive: true
					}
				});

				var indicator = angular.element(document.getElementById('minimap-indicator'));
				var indicatorWidth = ($window.innerWidth - 232) * 0.1;
				var indicatorHeight = ($window.innerHeight - 74) * 0.1;
				indicator.css('width', indicatorWidth + 'px');
				indicator.css('height', indicatorHeight + 'px');
			}, 0);

			// scrollArea.destroy();

			// scrollArea.scroll = new IScroll('#content-scrollarea', {
			// 	scrollX: true,
			// 	scrollY: true,
			// 	freeScroll: true,
			// 	mouseWheel: true,
			// 	scrollbars: true,
			// 	interactiveScrollbars: true,
			// 	disableMouse: false,
			// 	indicators: {
			// 		el: '#minimap',
			// 		interactive: true
			// 	}
			// });

			// scrollArea.addIndicator({
			// 	el: '#minimap',
			// 	interactive: true
			// });

			// scrollArea.refresh();

			console.log(scrollArea);

			scope.setTicket = function(ticket) {
				return {
					'background-color': ticket.color,
					'left': (ticket.position.x * 0.1) + 'px',
					'top': (ticket.position.y * 0.1) + 'px'
				}
			}
		}
	};
}
