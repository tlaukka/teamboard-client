'use strict';


module.exports = function($window, $timeout) {
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
				'background-image': 'url(../' + scope.board.background + ')',
				'-moz-transform': 'scale(' + scope.scale + ')',
				'-webkit-transform': 'scale(' + scope.scale + ')',
				'-o-transform': 'scale(' + scope.scale + ')',
				'-ms-transform': 'scale(' + scope.scale + ')',
				'transform': 'scale(' + scope.scale + ')'
			});

			scope.setTicket = function(ticket) {
				return {
					'left': ticket.position.x + 'px',
					'top': ticket.position.y + 'px'
				}
			}

			// scope.updateBackground = function(bg) {
			// 	scope.board.background = bg;
			// 	scope.board.update()
			// 		.then(function() {
			// 			scope.setBackground(bg);
			// 		});
			// }

			// scope.setBackground = function(bg) {
			// 	element.css('background-image', 'url(../' + bg + ')');
			// }

			// // triggered from TopBarController
			// scope.$on('action:add-background', function(event, data) {
			// 	scope.promptBackgroundAdd();
			// });
		}
	};
}
