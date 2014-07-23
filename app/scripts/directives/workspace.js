'use strict';


module.exports = function(scrollArea, $timeout) {
	return {
		restrict: 'AE',

		scope: {
			boards: '='
		},

		link: function(scope, element) {

			scope.updateHeight = function() {

				var boardRowCount = Math.floor(scope.boards.length / 3); // Full rows
				if ((scope.boards.length - boardRowCount * 3) != 0) {
					// Partial row
					boardRowCount++;
				}

				var height = (boardRowCount * 200) + 'px';
				element.css('height', height);
			}

			scope.$watch('boards.length', function() {
				scope.updateHeight();
				scrollArea.refresh();
			});
		}
	};
}
