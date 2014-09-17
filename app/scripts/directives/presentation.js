'use strict';


module.exports = function($window) {
	return {
		template: require('../../partials/presentation.html'),
		replace: true,
		restrict: 'E',

		scope: {
			board: '=',
			tickets: '='
		},

		link: function(scope, element) {

			scope.getMaxSize = function(srcWidth, srcHeight, maxWidth, maxHeight) {
				var ratio = [maxWidth / srcWidth, maxHeight / srcHeight];
				ratio = Math.min(ratio[0], ratio[1]);

				return { width: Math.floor(srcWidth * ratio), height: Math.floor(srcHeight * ratio) };
			}

			scope.updateSize = function() {
				var boardWidth = scope.board.size.width * 240;
				var boardHeight = scope.board.size.height * 135;
				var maxWidth = $window.innerWidth;
				var maxHeight = $window.innerHeight;
				var size = scope.getMaxSize(boardWidth, boardHeight, maxWidth, maxHeight);
				var left = Math.floor((maxWidth - size.width) / 2);
				var top = Math.floor((maxHeight - size.height) / 2);
				scope.scale = size.width / boardWidth;

				element.css({
					'left': left + 'px',
					'top': top + 'px',
					'width': boardWidth + 'px',
					'height': boardHeight + 'px',
					'background-size': '100%',
					'-moz-transform': 'scale(' + scope.scale + ')',
					'-webkit-transform': 'scale(' + scope.scale + ')',
					'-o-transform': 'scale(' + scope.scale + ')',
					'-ms-transform': 'scale(' + scope.scale + ')',
					'transform': 'scale(' + scope.scale + ')'
				});
			}

			scope.setBackground = function(bg) {
				element.css('background-image', 'url(../' + bg + ')');
			}

			scope.setBackground(scope.board.background);
			scope.updateSize();

			scope.setTicket = function(ticket) {
				return {
					'left': ticket.position.x + 'px',
					'top': ticket.position.y + 'px'
				}
			}

			scope.$watch('board.background', function() {
				scope.setBackground(scope.board.background);
			});

			angular.element($window).bind('resize', function() {
				scope.updateSize();
			});
		}
	};
}
