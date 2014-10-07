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
			var scale = scope.width / (scope.board.size.width * 240);
			var width = Math.floor(scope.board.size.width * 240 * scale) + 'px';
			var height = Math.floor(scope.board.size.height * 135 * scale) + 'px';

			element.css({
				'width': width,
				'height': height,
				'background-size': '100%'
			});

			$timeout(function() {
				scope.updateIndicator();
			}, 0);

			scope.setTicket = function(ticket) {
				return {
					'background-color': ticket.color,
					'left': (ticket.position.x * scale) + 'px',
					'top': (ticket.position.y * scale) + 'px',
					'width': (226 * scale) + 'px',
					'height': (128 * scale) + 'px'
				}
			}

			scope.updateIndicator = function() {
				var isSidebarCollapsed = (localStorage.getItem('tb-sidebar-collapsed') === 'true');
				if ($window.innerWidth < 768) {
					isSidebarCollapsed = true;
				}

				var indicatorWidth = isSidebarCollapsed ? ($window.innerWidth - 74) : ($window.innerWidth - 232);
				indicatorWidth *= scale;
				var indicatorHeight = ($window.innerHeight - 64) * scale;

				var indicator = angular.element(element.children()[0]);
				indicator.css({
					'width': indicatorWidth + 'px',
					'height': indicatorHeight + 'px'
				});
			}

			scope.setBackground = function(bg) {
				element.css('background-image', 'url(../' + bg + ')');
			}

			scope.$on('action:sidebar-collapse', function(event, isCollapsed) {
				scope.updateIndicator();
			});

			angular.element($window).bind('resize', function() {
				scope.updateIndicator();
			});

			scope.$watch('board.background', function() {
				scope.setBackground(scope.board.background);
			});
		}
	};
}
