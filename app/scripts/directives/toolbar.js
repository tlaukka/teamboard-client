'use strict';


module.exports = function() {
	return {
		template: require('../../partials/toolbar.html'),
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: {},

		link: function(scope, element) {

		}
	};
}
