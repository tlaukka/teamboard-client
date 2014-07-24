'use strict';


var _ = require('underscore');

module.exports = function($scope, Ticket, modalService, socketService,
		resolvedBoard) {

	// board resolved in the ui-router
	$scope.board = resolvedBoard;

	// shorthand for finding a ticket from the scopes ticket collection
	var _getTicket = function(id) {
		return _.find($scope.board.tickets, function(ticket) {
			return ticket.id === id;
		});
	}

	// create a new ticket in our clients collection if necessary
	socketService.on('ticket:create', function(ticketData) {
		console.log('socket - ticket:create', ticketData);

		var ticketDoesExist = _getTicket(ticketData.id);

		// if the ticket does not already exist in our client (maybe we
		// added it ourselves) we add it to our clients collection
		if(!ticketDoesExist) {
			return $scope.board.tickets.push(new Ticket(ticketData));
		}

		return $scope.$apply();
	});

	// update a ticket in our collection, create it if necessary
	socketService.on('ticket:update', function(ticketData) {
		console.log('socket - ticket:update', ticketData);

		var existingTicket = _getTicket(ticketData.id);

		// for some reason the ticket does not yet exist in our client
		// so we need to add it to our clients collection
		if(!existingTicket) {
			return $scope.board.tickets.push(new Ticket(ticketData));
		}

		// the ticket already exists in our clients collection, so
		// we can just update the attributes of it
		existingTicket.color    = ticketData.color;
		existingTicket.heading  = ticketData.heading;
		existingTicket.content  = ticketData.content;
		existingTicket.position = ticketData.position;

		return $scope.$apply();
	});

	// remove a ticket from our clients collection if it exists
	socketService.on('ticket:remove', function(ticketData) {
		console.log('socket - ticket:remove', ticketData);

		$scope.board.tickets = _.reject($scope.board.tickets,
			function(ticket) {
				return ticket.id === ticketData.id;
			});

		return $scope.apply();
	});

	// TODO Move these to app configuration?
	$scope.snapOptions = {
		enabled:    false,
		gridWidth:  215,
		gridHeight: 146
	}

	// triggered from TopBarController
	$scope.$on('action:create', function(event, data) {
		$scope.promptTicketCreate();
	});

	// triggered from TopBarController
	$scope.$on('action:enable-snap', function(event, data) {
		$scope.snapOptions.enabled = !$scope.snapOptions.enabled;
	});

	// triggered from TicketDirective
	$scope.$on('action:remove', function(event, data) {

		var filter = function(ticket) { return ticket.id === data.id }
		var ticket = _.find($scope.board.tickets, filter);

		if(ticket) {
			ticket.remove().then(
				function() {
					$scope.board.tickets = _.reject(
						$scope.board.tickets, filter);
				},
				function(err) {
					// wat do
					console.log(err);
				});
		}
	});

	$scope.createTicket = function(ticketData) {
		// TODO Allow a predefined position
		ticketData.board    = $scope.board.id;
		ticketData.position = { x: 0, y: 0, z: 1000 }

		return new Ticket(ticketData).save().then(
			function(ticket) {
				$scope.board.tickets.push(ticket);
			},
			function(err) {
				// TODO Handle it
				console.log(err);
			});
	}

	$scope.editTicket = function(ticket, attrs) {
		ticket.color   = attrs.color;
		ticket.heading = attrs.heading;
		ticket.content = attrs.content;

		return ticket.save().then(
			function(ticket) {
				console.log('updated', ticket);
			},
			function(err) {
				// TODO Handle it
				console.log(err);
			});
	}

	$scope.promptTicketCreate = function() {
		var modalOptions = {
			template: require('../../partials/modal-ticketcreate.html')
		}

		return modalService.show(modalOptions, null).then(function(result) {
			return $scope.createTicket(result);
		});
	}

	$scope.promptEditTicket = function(ticket) {
		var modalOptions = {
			template: require('../../partials/modal-ticketedit.html')
		}

		var userOptions = {
			color:   ticket.color,
			heading: ticket.heading,
			content: ticket.content,
			owner:   ticket.owner
		}

		modalService.show(modalOptions, userOptions).then(function(result) {
			$scope.editTicket(ticket, result);
		});
	}
}
