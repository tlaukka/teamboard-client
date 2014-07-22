'use strict';


module.exports = function(scrollArea, $timeout) {
	return {
		link: function(scope, element) {

			if (scope.$last) {
				// angular.element(window).bind('load', function() {
				// scrollArea.scroll.refresh();
				// console.debug('refresh');
			}

			// $timeout(function() {
			// 	scrollArea.scroll.refresh();
			// 	console.debug('refresh');
			// }, 0);
		}
	};
}