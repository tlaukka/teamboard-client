'use strict';


module.exports = function(scrollArea) {

	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');

	return {
		restrict: 'E',
		template: require('../../partials/boardpreview.html'),
		replace: true,

		scope: {
			index: '@',
			board: '=boardData',
			workspaceState: '=workspaceState',
			promptBoardRemove: '&boardRemove',
			promptBoardEdit: '&boardEdit',
			toggleBoardSelection: '&boardToggle'
		},

		link: function(scope, element) {

			scope.isLoading = false;

			scope.onBoardClicked = function() {

				scope.isLoading = true;
				scope.workspaceState.isLoadingBoard = true;

				var thumbnailContainer = angular.element(element.children()[0]);
				thumbnailContainer.css('z-index', 1000);

				// scrollArea.scrollTo(0, 0);

				// var row = Math.floor(scope.index / 3);
				// var col = scope.index % 3;

				// var marginX = -((col + 1) * 36 + col * 24);
				// var marginY = -((row + 1) * 36 + row * 24);

				// var newX = marginX - col * 200 - 5;
				// var newY = marginY - row * 184;

				// var thumbnailContainer = angular.element(element.children()[0]);
				// thumbnailContainer.css('z-index', 1000);
				// thumbnailContainer.css('border', 'none');
				// thumbnailContainer.css('box-shadow', 'none');

				// TweenLite.to(thumbnailContainer, 0.4, {
				// 	left: newX,
				// 	top: newY,
				// 	scaleX: 5,
				// 	scaleY: 5,
				// 	transformOrigin: 'left top'
				// });
			}

			scope.selectBoard = function() {
				if (element.hasClass('selected')) {
					element.removeClass('selected');
				}
				else {
					element.addClass('selected');
				}

				scope.toggleBoardSelection({ index: scope.index });
			}
		}
	};
}
