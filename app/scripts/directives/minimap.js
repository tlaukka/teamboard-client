'use strict';


module.exports = function($window, $timeout) {
	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');

	return {
		template: require('../../partials/minimap.html'),
		restrict: 'E',
		replace: true,

		scope: {
			board: '=',
			tickets: '=',
			width: '@',
			indicator: '@'
		},

		link: function(scope, element) {

			// Set minimap size according to scale.
			// One horizontal unit: 240px
			// One vertical unit: 135px
			var unitH = 240;
			var unitV = 135;
			var marginTop = 100;
			var marginLeft = 80;
			var scale = scope.width / (scope.board.size.width * unitH);
			// var width = Math.floor(scope.board.size.width * 240 * scale) + 'px';
			// var height = Math.floor(scope.board.size.height * 135 * scale) + 'px';


			var width = Math.floor((scope.board.size.width * unitH + marginTop + marginLeft) * scale) + 'px';
			var height = Math.floor((scope.board.size.height * unitV + 2 * marginLeft) * scale) + 'px';
			var bgPos = Math.floor(marginLeft * scale) + 'px ' + Math.floor(marginTop * scale) + 'px';
			var bgWidth = Math.floor(scope.board.size.width * unitH * scale) + 'px';
			var bgHeight = Math.floor(scope.board.size.height * unitV * scale) + 'px';
			var bgSize = bgWidth + ' ' + bgHeight;

			element.css({
				'width': width,
				'height': height,
				// 'background-size': '100%'
				'background-position': bgPos,
				'background-size': bgSize
			});

			if (scope.indicator == 'true') {
				$timeout(function() {
					scope.updateIndicator();
				}, 0);

				// scope.$on('action:sidebar-collapse', function(event, isCollapsed) {
				// 	scope.updateIndicator(isCollapsed);
				// });

				angular.element($window).bind('resize', function() {
					scope.updateIndicator();
				});
			}

			scope.setTicket = function(ticket) {
				return {
					'background-color': ticket.color,
					'left': ((ticket.position.x + 80) * scale) + 'px',
					'top': ((ticket.position.y + 100) * scale) + 'px',
					'width': (226 * scale) + 'px',
					'height': (128 * scale) + 'px'
				}
			}

			scope.updateIndicator = function(isSidebarCollapsed) {
				// if ($window.innerWidth < 768) {
				// 	isSidebarCollapsed = true;
				// }

				// var indicatorWidth = isSidebarCollapsed ? ($window.innerWidth - 74) : ($window.innerWidth - 232);
				var indicatorWidth = $window.innerWidth * scale;
				// indicatorWidth *= scale;
				// var indicatorHeight = ($window.innerHeight - 64) * scale;
				var indicatorHeight = $window.innerHeight * scale;

				var indicator = angular.element(element.children()[0]);
				indicator.css({
					'width': indicatorWidth + 'px',
					'height': indicatorHeight + 'px'
				});
			}

			scope.setBackground = function(bg) {
				element.css('background-image', 'url(../' + bg + ')');
			}

			scope.$watch('board.background', function() {
				scope.setBackground(scope.board.background);
			});
		}
	};
}
