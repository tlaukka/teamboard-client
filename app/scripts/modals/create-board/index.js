'use strict';

module.exports = function Modal($modal, $rootScope) {
	return {
		open: function(props, opts) {
			var scope       = $rootScope.$new()
			    scope.props = _.clone(props);
			return $modal.open(_.merge({ scope: scope }, opts));
		}
	}
}
