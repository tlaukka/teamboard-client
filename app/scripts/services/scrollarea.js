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

	scroller.scrollTo = function(x, y) {
		if (this.scroll != null) {
			this.scroll.scrollTo(x, y);
		}
	}

	scroller.enable = function() {
		if (this.scroll != null) {
			this.scroll.enable();
		}
	}

	scroller.disable = function() {
		if (this.scroll != null) {
			this.scroll.disable();
		}
	}

	return scroller;
}
