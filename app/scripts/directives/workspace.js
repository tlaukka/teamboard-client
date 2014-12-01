'use strict';


module.exports = function(scrollArea, $timeout, $window, $document) {

	var IScroll = require('iscroll');

	return {
		restrict: 'A',
		scope: true,

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
					disableMouse: false
				}));
			}, 0);

			scope.updateWorkspace = function() {
				var scroller = angular.element(document.getElementById('content-scrollarea'));

				// workspaceWidth / (boardPreviewWidth + margin)
				var boardsPerRow = Math.floor((scroller[0].clientWidth - 24) / 254);
				boardsPerRow = Math.min(Math.max(boardsPerRow, 1), 8);

				var boardRowCount = Math.floor(scope.boards.length / boardsPerRow); // Full rows
				if ((scope.boards.length - boardRowCount * boardsPerRow) != 0) {
					// Partial row
					boardRowCount++;
				}

				// (boardRowCount * boardPreviewHeight + margin) + 2 * margin
				var height = (boardRowCount * 212 + 48 + 140) + 'px';
				element.css('height', height);
			}

			scope.showLoadingOverlay = function() {
				var loadingOverlay = angular.element(document.getElementById('loading-overlay'));
				loadingOverlay.addClass('visible');
			}

			// scope.$on('action:sidebar-collapse', function(event, isCollapsed) {
			// 	scope.updateWorkspace();
			// });

			scope.$watch('boards.length', function() {
				scope.updateWorkspace();
				scrollArea.refresh(0);
			});

			scope.$watch('state.isLoadingBoard', function() {
				// Show overlay when loading board.
				if (scope.state.isLoadingBoard) {
					scope.showLoadingOverlay();
				}
			});

			angular.element($window).bind('resize', function() {
				scope.updateWorkspace();
			});
		}
	};
}
