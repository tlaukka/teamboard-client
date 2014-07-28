'use strict';


var angular = require('angular');

// required third party modules
require('angular-ui-router');
require('angular-bootstrap');
require('angular-truncate');
require('angular-sanitize');
require('angular-text');

// main module
// TODO split into modules based on features
angular.module('tb', [
		'ui.router',
		'ui.bootstrap',
		'truncate',
		'ngSanitize',
		'textAngular',
		require('./modules/configuration').name,
		require('./modules/authentication').name,
		require('./modules/uservoice').name
	])

	.run(function($state, Config) {
		$state.go(Config.states.main);
	})

	.config(require('./config/routes'))
	.config(require('./config/decorators'))

	.directive('tbBoard',        require('./directives/board'))
	.directive('tbTicket',       require('./directives/ticket'))
	.directive('ngClick',        require('./directives/click'))
	.directive('tbGravatar',     require('./directives/gravatar'))
	.directive('tbAutoFocus',    require('./directives/autofocus'))
	.directive('tbTicketProxy',  require('./directives/ticketproxy'))
	.directive('tbScrollArea',   require('./directives/scrollarea'))
	.directive('tbWorkspace',    require('./directives/workspace'))
	.directive('tbBoardPreview', require('./directives/boardpreview'))

	.factory('Board',         require('./services/board'))
	.factory('Ticket',        require('./services/ticket'))
	.service('modalService',  require('./services/modal'))
	.factory('socketService', require('./services/socket'))
	.factory('ticketProxy',   require('./services/ticketproxy'))
	.factory('scrollArea',    require('./services/scrollarea'));




	// TODO add non-modularized functionality...
	// TODO change the initial state to main...
