'use strict';


module.exports = function($timeout) {
	var scrollArea = {
		scroller: null
	};

	scrollArea.set = function(scroller) {
		this.scroller = scroller;
	}

	scrollArea.destroy = function() {
		if (this.scroller != null) {
			this.scroller.destroy();
			this.scroller = null;
		}
	}

	scrollArea.refresh = function(delay) {
		if (this.scroller != null) {
			var scroller = this.scroller;
			$timeout(function() {
				scroller.refresh();
			}, delay);
		}
	}

	scrollArea.scrollTo = function(x, y) {
		if (this.scroller != null) {
			this.scroller.scrollTo(x, y);
		}
	}

	scrollArea.enable = function() {
		if (this.scroller != null) {
			this.scroller.enable();
		}
	}

	scrollArea.disable = function() {
		if (this.scroller != null) {
			this.scroller.disable();
		}
	}

	return scrollArea;
}
