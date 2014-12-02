'use strict';


module.exports = function($window, $timeout, Modal, scrollArea) {

	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');
	var Draggable = require('Draggable');
	var IScroll = require('iscroll');

	return {
		// replace: true,
		restrict: 'A',
		scope: true,
		// scope: {
		// 	board: '='
		// 	// zoom: '=zoomOptions'
		// },

		link: function(scope, element) {

			scrollArea.destroy();
			scrollArea.set(new IScroll('#content-scrollarea', {
				scrollX: true,
				scrollY: true,
				freeScroll: true,
				mouseWheel: true,
				scrollbars: true,
				interactiveScrollbars: true,
				disableMouse: false,
				keyBindings: true,

				indicators: {
					el: '.minimap',
					interactive: true,
					resize: false,
					shrink: false
				}
			}));

			$timeout(function() {
				// Set current background image
				scope.setBackground(scope.board.background);
			}, 0);

			// scrollArea.refresh(0);
			scope.isPresentationVisible = true;

			scope.promptBackgroundAdd = function() {
				var backgrounds = [
					{ name: 'Blank',            url: 'none'                                         },
					{ name: 'Kanban',           url: 'images/backgrounds/kanban.png'                },
					{ name: 'Scrum',            url: 'images/backgrounds/scrum.png'                 },
					{ name: 'Business model',   url: 'images/backgrounds/business_model_canvas.png' },
					{ name: 'SWOT',             url: 'images/backgrounds/swot.png'                  },
					{ name: 'Customer journey', url: 'images/backgrounds/customer_journey_map.png'  },
					{ name: 'Keep drop try',    url: 'images/backgrounds/keep_drop_try.png'         },
					{ name: 'Play',             url: 'images/backgrounds/play.png'                  },
				];

				var props = {
					'current':     scope.board.background,
					'backgrounds': backgrounds,
				}

				var options = {
					'size':     'lg',
					'template': require('../../partials/modals/edit-background.html'),
				}

				Modal.open(props, options).result.then(function(result) {
					return scope.updateBackground(result.current);
				});
			}

			scope.updateBackground = function(bg) {
				scope.board.background = bg;
				scope.board.update()
					.then(function() {
						scope.setBackground(bg);
					});
			}

			scope.setBackground = function(bg) {
				element.css('background-image', 'url(../' + bg + ')');
			}

			// scope.applySearch = function(searchStr) {
			// 	console.log(searchStr);
			// }

			// triggered from TopBarController
			scope.$on('action:add-background', function(event, data) {
				scope.promptBackgroundAdd();
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
