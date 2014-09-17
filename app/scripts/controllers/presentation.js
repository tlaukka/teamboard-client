'use strict';


module.exports = function($scope, $state, authService, socketService, currentUser, resolvedBoard, tickets) {

	$scope.board = resolvedBoard;
	$scope.tickets = tickets;

	var _getTicket = function(id) {
		return _.find($scope.tickets, function(ticket) {
			return ticket.id === id;
		});
	}

	// create a new ticket in our clients collection if necessary
	socketService.on('ticket:create', function(ev) {
		if (ev.board !== $scope.board.id) {
			return;
		}

		if (currentUser.id === ev.user.id) {
			return console.log('ticket:create made by this client');
		}

		var ticketDoesExist = (_getTicket(ev.tickets[0].id) != undefined)

		// if the ticket does not already exist in our client (maybe we
		// added it ourselves) we add it to our clients collection
		if (!ticketDoesExist) {
			$scope.tickets.push(new Ticket(ev.tickets[0]));
			return $scope.$apply();
		}
	});

	// update a ticket in our collection, create it if necessary
	socketService.on('ticket:update', function(ev) {
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

		var existingTicket = _getTicket(ev.tickets[0].id);

		// for some reason the ticket does not yet exist in our client
		// so we need to add it to our clients collection
		if (!existingTicket) {
			return $scope.tickets.push(new Ticket(ev.tickets[0]));
		}

		// the ticket already exists in our clients collection, so
		// we can just update the attributes of it
		existingTicket.color    = ev.tickets[0].color;
		existingTicket.heading  = ev.tickets[0].heading;
		existingTicket.content  = ev.tickets[0].content;
		existingTicket.position = ev.tickets[0].position;

		return $scope.$apply();
	});

	// remove a ticket from our clients collection if it exists
	socketService.on('ticket:remove', function(ev) {
		if (ev.board !== $scope.board.id) {
			return;
		}

		$scope.tickets = _.reject($scope.tickets,
			function(ticket) {
				return _.contains(_.pluck(ev.tickets, 'id'), ticket.id);
			});

		return $scope.$apply();
	});
}
