'use strict';


module.exports = function(scrollArea, $timeout, $window) {
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

				var height = (boardRowCount * 224 + 48) + 'px';
				element.css('height', height);
			}

			scope.$watch('boards.length', function() {
				scope.updateHeight();
				scrollArea.refresh();
			});

			scope.$watch('state.isLoadingBoard', function() {
				// Show overlay when loading board.
				if (scope.state.isLoadingBoard) {
					var width = $window.outerWidth + 'px';
					var height = $window.outerHeight + 'px';
					var loadingOverlay = angular.element(element.children()[0]);

					loadingOverlay.css('width', width);
					loadingOverlay.css('height', height);
					loadingOverlay.addClass('visible');
				}
			});
		}
	};
}
