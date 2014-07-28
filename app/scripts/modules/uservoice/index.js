'use strict';

var angular = require('angular');

module.exports = angular.module('tb.uservoice', [])
	.directive('uservoiceTrigger', require('./directives/uservoice'));
