'use strict';


var angular = require('angular');
              require('angular-ui-router');

/**
 * Adds authentication capabilities to 'tb' application.
 */
module.exports = angular.module('tb.authentication', [
		'ui.router',
		require('../configuration').name
	])
	.config(require('./config'))
	.factory('authService', require('./services/authentication'));
