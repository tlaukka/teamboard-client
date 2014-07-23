'use strict';


module.exports = function(scrollArea, $timeout) {
	return {
		restrict: 'AE',

		link: function(scope, element) {

			// if (scope.$last) {
			// 	$timeout(function() {
			// 		scrollArea.refresh();
			// 	}, 300);
			// }
		}
	};
}
