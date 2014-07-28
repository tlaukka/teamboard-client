'use strict';


module.exports = function(scrollArea, $timeout) {
	return {
		restrict: 'AE',

		scope: {
			boards: '=',
			state: '='
		},

		link: function(scope, element) {

			scope.updateHeight = function() {

				var boardRowCount = Math.floor(scope.boards.length / 3); // Full rows
				if ((scope.boards.length - boardRowCount * 3) != 0) {
					// Partial row
					boardRowCount++;
				}

				var height = (boardRowCount * 250) + 'px';
				element.css('height', height);
			}

			scope.$watch('boards.length', function() {
				scope.updateHeight();
				scrollArea.refresh();
			});

			scope.$watch('state.isLoadingBoard', function() {
				if (scope.state.isLoadingBoard) {
					var loadingOverlay = angular.element(element.children()[0]);
					loadingOverlay.addClass('visible');
				}
			});

			// scope.$on('action:loading-board', function() {
			// 	console.log('loading...');
			// });
		}
	};
}
