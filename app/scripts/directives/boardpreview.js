'use strict';


module.exports = function() {
	return {
		restrict: 'AE',
		template: require('../../partials/boardpreview.html'),
		replace: true,

		scope: {
			index: '@',
			board: '=boardData',
			promptBoardRemove: '&boardRemove',
			editBoard: '&boardEdit',
			toggleBoardSelection: '&boardToggle'
		},

		link: function(scope, element) {
			// console.debug('board index: ' + scope.index);

			scope.selectBoard = function() {

				if (element.hasClass('selected')) {
					element.removeClass('selected');
				}
				else {
					element.addClass('selected');
				}

				scope.toggleBoardSelection(scope.index);
			}
		}
	};
}
