'use strict';


module.exports = function() {
	return function(items) {
		// Create a copy of the array and reverse the order of the items
		return items.slice().reverse();
	};
}
