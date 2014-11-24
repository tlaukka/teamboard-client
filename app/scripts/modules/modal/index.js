'use strict';

var _       = require('lodash');
var angular = require('angular');

/**
 *
 */
require('angular-bootstrap');

/**
 *
 */
module.exports = angular.module('tb.modal', [ 'ui.bootstrap' ])

	/**
	 *
	 */
	.factory('Modal', function Modal($modal, $rootScope) {
		return {
			open: function(props, opts) {
				var scope       = $rootScope.$new()
				    scope.props = _.clone(props);
				return $modal.open(_.merge({ 'scope': scope }, opts));
			}
		}
	});
