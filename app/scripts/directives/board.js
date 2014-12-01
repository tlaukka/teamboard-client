'use strict';


module.exports = function($window, $timeout, Modal, scrollArea) {

	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');
	var Draggable = require('Draggable');
	var IScroll = require('iscroll');

	return {
		restrict: 'A',
		scope: true,
		// scope: {
		// 	board: '='
		// 	// zoom: '=zoomOptions'
		// },

		link: function(scope, element) {

			scrollArea.destroy();

			$timeout(function() {
				scrollArea.set(new IScroll('#content-scrollarea', {
					scrollX: true,
					scrollY: true,
					freeScroll: true,
					mouseWheel: true,
					scrollbars: true,
					interactiveScrollbars: true,
					disableMouse: false,

					indicators: {
						el: '.minimap',
						interactive: true,
						resize: false,
						shrink: false
					}
				}));

				// Set current background image
				scope.setBackground(scope.board.background);
				scrollArea.refresh(0);
			}, 0);

			// scrollArea.refresh(0);
			scope.isPresentationVisible = true;

			scope.setHilightStyle = function(ticket) {
				return {
					'top': ticket.position.y + 'px',
					'left': ticket.position.x + 'px',
					'-webkit-box-shadow': '0 0 4px 3px ' + ticket.color,
					'box-shadow': '0 0 4px 3px ' + ticket.color
				};
			}

			scope.setBackground = function(bg) {
				element.css('background-image', 'url(../' + bg + ')');
			}

			// scope.applySearch = function(searchStr) {
			// 	console.log(searchStr);
			// }

			// triggered from TopBarController
			scope.$on('action:add-background', function(event, data) {
				scope.setBackground(data);
			});

			scope.$on('action:toggle-minimap', function(event, data) {
				scrollArea.refresh(0);
			});

			// var zoom = scope.zoom;
			// var transformOrigin = 'center top';

			// scope.zoomOut = function() {
			// 	var html = angular.element(document.querySelector('html'))[0];
			// 	var scale = 0.9 * html.clientHeight / element[0].offsetHeight;
			// 	TweenLite.to(element, 0.6, { scale: scale, transformOrigin: transformOrigin });
			// }

			// scope.zoomNormal = function() {
			// 	TweenLite.to(element, 0.6, { scale: 1, transformOrigin: transformOrigin });
			// }

			// scope.$watch('zoom.out', function() {
			// 	if (zoom.out) {
			// 		scope.zoomOut();
			// 	}
			// 	else {
			// 		scope.zoomNormal();
			// 	}
			// });

			// scope.$watchCollection('tickets', function() {

			// });
		}
	};
}
