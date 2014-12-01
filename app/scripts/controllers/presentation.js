'use strict';

var _ = require('lodash');
var utf8 = require('utf8');

module.exports = function(
	$scope,
	$state,
	connectedSocket,
	currentUser,
	resolvedBoard,
	ticketCollection
	) {

	$scope.board = resolvedBoard;
	$scope.tickets = ticketCollection.getTickets();

	$scope.$on('$stateChangeStart', function() {
		connectedSocket.off('ticket:create');
		connectedSocket.off('ticket:update');
		connectedSocket.off('ticket:remove');
	});

	// create a new ticket in our clients collection if necessary
	connectedSocket.on('ticket:create', function(ev) {
		if (ev.board !== $scope.board.id) {
			return;
		}

		if (currentUser.id === ev.user.id) {
			return console.log('ticket:create made by this client');
		}

		var ticketDoesExist = (ticketCollection.findTicket(ev.ticket.id) != undefined)

		// if the ticket does not already exist in our client (maybe we
		// added it ourselves) we add it to our clients collection
		if (!ticketDoesExist) {
			ev.ticket.color   = utf8.decode(ev.ticket.color);
			ev.ticket.heading = utf8.decode(ev.ticket.heading);
			ev.ticket.content = utf8.decode(ev.ticket.content);

			ticketCollection.addTicketLocal(ev.ticket);
			return $scope.$apply();
		}
	});

	// update a ticket in our collection, create it if necessary
	connectedSocket.on('ticket:update', function(ev) {
		if (ev.board !== $scope.board.id) {
			return;
		}

		// fix issues with self-made updates overriding client
		//
		// TODO use a unique client-id to prevent possible issues
		//      with same user on multiple devices
		if (currentUser.id === ev.user.id) {
			return console.log('ticket:update made by this client');
		}

		var existingTicket = ticketCollection.findTicket(ev.ticket.id);

		// for some reason the ticket does not yet exist in our client
		// so we need to add it to our clients collection
		if (!existingTicket) {
			ev.ticket.color   = utf8.decode(ev.ticket.color);
			ev.ticket.heading = utf8.decode(ev.ticket.heading);
			ev.ticket.content = utf8.decode(ev.ticket.content);
			return ticketCollection.addTicketLocal(ev.ticket);
		}

		// the ticket already exists in our clients collection, so
		// we can just update the attributes of it
		existingTicket.color    = utf8.decode(ev.ticket.color);
		existingTicket.heading  = utf8.decode(ev.ticket.heading);
		existingTicket.content  = utf8.decode(ev.ticket.content);
		existingTicket.position = ev.ticket.position;

		return $scope.$apply();
	});

	// remove a ticket from our clients collection if it exists
	connectedSocket.on('ticket:remove', function(ev) {
		if (ev.board !== $scope.board.id) {
			return;
		}

		ticketCollection.removeTicketLocal(ev.ticket.id);
		$scope.tickets = ticketCollection.getTickets();

		return $scope.$apply();
	});
}
