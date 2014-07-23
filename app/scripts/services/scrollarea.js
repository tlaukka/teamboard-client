'use strict';


module.exports = function() {
	var scroller = {
		scroll: null
	};

	scroller.refresh = function() {
		if (this.scroll != null) {
			this.scroll.refresh();
		}
	}

	return scroller;
}
