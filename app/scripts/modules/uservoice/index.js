'use strict';

var angular = require('angular');

angular.module('tb.uservoice', [])
	.directive('uservoiceTrigger', require('./directives/uservoice.js'));