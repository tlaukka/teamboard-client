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
			var unitW = 240;
			var unitH = 135;
			var marginTop = 140;
			var marginRight = 80;
			var marginBottom = 80;
			var marginLeft = 80;

			var scale = scope.width / (scope.board.size.width * unitW + marginLeft + marginRight);
			var width = ((scope.board.size.width * unitW + marginLeft + marginRight) * scale) + 'px';
			var height = ((scope.board.size.height * unitH + marginTop + marginBottom) * scale) + 'px';
			var bgPos = (marginLeft * scale) + 'px ' + (marginTop * scale) + 'px';
			var bgWidth = (scope.board.size.width * unitW * scale + 2) + 'px';
			var bgHeight = (scope.board.size.height * unitH * scale + 1) + 'px';
			var bgSize = bgWidth + ' ' + bgHeight;

			element.css({
				'width': width,
				'height': height,
				'background-position': bgPos,
				'background-size': bgSize
			});

			if (scope.indicator == 'true') {
				$timeout(function() {
					scope.updateIndicator();
				}, 0);

				angular.element($window).bind('resize', function() {
					scope.updateIndicator();
				});
			}

			scope.setTicket = function(ticket) {
				return {
					'background-color': ticket.color,
					'top': ((ticket.position.y + marginTop) * scale) + 'px',
					'left': ((ticket.position.x + marginLeft) * scale) + 'px',
					'width': (226 * scale) + 'px',
					'height': (128 * scale) + 'px'
				};
			}

			scope.updateIndicator = function() {
				var indicatorWidth = $window.innerWidth * scale;
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
