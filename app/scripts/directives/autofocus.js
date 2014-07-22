'use strict';


module.exports = function($timeout) {
	return {
		restrict: 'AC',
		link: function(scope, element) {
			$timeout(function() { element[0].focus(); }, 100);
		}
	}
}
