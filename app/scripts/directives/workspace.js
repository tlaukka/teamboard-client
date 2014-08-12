'use strict';


module.exports = function(scrollArea, $timeout, $window) {
	return {
		restrict: 'AE',

		scope: {
			boards: '=',
			state: '='
		},

		link: function(scope, element) {

			scope.updateWorkspace = function() {
				var scroller = angular.element(document.getElementById('content-scrollarea'));
				// (workspaceWidth / (boardPreviewWidth + margin)) * (boardPreviewWidth + margin)
				// var width = Math.floor(scroller[0].clientWidth / 254) * 254;

				// console.log(scroller);
				// console.log('clientWidth: ' + scroller[0].offsetWidth + ', ' + scroller[0].offsetHeight);


				// workspaceWidth / (boardPreviewWidth + margin)
				var boardsPerRow = Math.floor(scroller[0].clientWidth / 254);
				boardsPerRow = Math.min(Math.max(boardsPerRow, 1), 8);

				var boardRowCount = Math.floor(scope.boards.length / boardsPerRow); // Full rows
				if ((scope.boards.length - boardRowCount * boardsPerRow) != 0) {
					// Partial row
					boardRowCount++;
				}

				// (boardRowCount * boardPreviewHeight + margin) + 2 * margin
				var height = (boardRowCount * 224 + 48) + 'px';
				// console.log('height: ' + height);
				element.css('height', height);
			}

			scope.$on('action:sidebar-collapse', function(event, isCollapsed) {
				scope.updateWorkspace();
				scrollArea.refresh();
			});

			scope.$watch('boards.length', function() {
				scope.updateWorkspace();
				scrollArea.refresh();
			});

			angular.element($window).bind('resize', function() {
				scope.updateWorkspace();
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
