'use strict';


var _ = require('underscore');

module.exports = function($scope, $rootScope, Board, Ticket, modalService, socketService, resolvedBoard, currentUser) {

	// board resolved in the ui-router
	$scope.board = resolvedBoard;

	// shorthand for finding a ticket from the scopes ticket collection
	var _getTicket = function(id) {
		return _.find($scope.board.tickets, function(ticket) {
			return ticket.id === id;
		});
	}

	// create a new ticket in our clients collection if necessary
	socketService.on('ticket:create', function(ev) {
		console.log('socket - ticket:create', ev);

		if(currentUser.id === ev.user.id) {
			return console.log('ticket:create made by this client');
		}

		var ticketDoesExist = (_getTicket(ev.tickets[0].id) != undefined)

		// if the ticket does not already exist in our client (maybe we
		// added it ourselves) we add it to our clients collection
		if(!ticketDoesExist) {
			$scope.board.tickets.push(new Ticket(ev.tickets[0]));
			return $scope.$apply();
		}
	});

	// update a ticket in our collection, create it if necessary
	socketService.on('ticket:update', function(ev) {
		console.log('socket - ticket:update', ev);

		// fix issues with self-made updates overriding client
		//
		// TODO use a unique client-id to prevent possible issues
		//      with same user on multiple devices
		if(currentUser.id === ev.user.id) {
			return console.log('ticket:update made by this client');
		}

		var existingTicket = _getTicket(ev.tickets[0].id);

		// for some reason the ticket does not yet exist in our client
		// so we need to add it to our clients collection
		if(!existingTicket) {
			return $scope.board.tickets.push(new Ticket(ev.tickets[0]));
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
		console.log('socket - ticket:remove', ev);
		$scope.board.tickets = _.reject($scope.board.tickets,
			function(ticket) {
				return _.contains(_.pluck(ev.tickets, 'id'), ticket.id);
			});
		return $scope.$apply();
	});

	$scope.selectedTicketIds = [];

	// TODO Move these to app configuration?
	$scope.snapOptions = {
		enabled:    false,
		gridWidth:  242,
		gridHeight: 136
	}

	// triggered from TopBarController
	$scope.$on('action:create', function(event, data) {
		$scope.promptTicketCreate();
	});

	// triggered from TopBarController
	$scope.$on('action:enable-snap', function(event, data) {
		$scope.snapOptions.enabled = !$scope.snapOptions.enabled;
	});

	// triggered from TopBarController
	$scope.$on('action:edit-board', function(event, data) {
		$scope.promptBoardEdit($scope.board);
	});

	// triggered from TopBarController
	$scope.$on('action:remove', function(event, data) {
		$scope.promptTicketRemove($scope.selectedTicketIds, function() {
			// Clear ticket selections if tickets were deleted
			$scope.selectedTicketIds.length = 0;
		});
	});

	// triggered from TopBarController
	$scope.$on('action:edit', function(event, data) {
		// var ticket = $scope.board.tickets[$scope.selectedTicketIds[0]];

		var ticket = _.find($scope.board.tickets, function(ticket) {
			return ticket.id == $scope.selectedTicketIds[0];
		});

		$scope.promptTicketEdit(ticket);
	});

	// Enable/disable necessary toolbar buttons.
	$scope.$watch('selectedTicketIds.length', function() {
		if ($scope.selectedTicketIds.length != 0) {
			$rootScope.$broadcast('ui:enable-remove', true);

			// Enable edit only if a single ticket is selected.
			if ($scope.selectedTicketIds.length == 1) {
				$rootScope.$broadcast('ui:enable-edit', true);
			}
			else {
				$rootScope.$broadcast('ui:enable-edit', false);
			}
		}
		else {
			$rootScope.$broadcast('ui:enable-remove', false);
			$rootScope.$broadcast('ui:enable-edit', false);
		}
	});

	$scope.toggleTicketSelection = function(id) {
		var selectedIndex = $scope.selectedTicketIds.indexOf(id);

		if (selectedIndex == -1) {
			$scope.selectedTicketIds.push(id);
		}
		else {
			$scope.selectedTicketIds.splice(selectedIndex, 1);
		}
	}

	$scope.removeTicketSelections = function($event) {
		$event.stopPropagation();
		$rootScope.$broadcast('action:select-tickets', false);
		$scope.selectedTicketIds.length = 0;
	}

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

	$scope.removeTicket = function(id) {
		var filter = function(ticket) { return ticket.id === id }
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
	}

	$scope.removeTickets = function(ids, callback) {
		Ticket.remove($scope.board.id, ids).then(
			function() {
				$scope.board.tickets = _.reject($scope.board.tickets,
					function(ticket) {
						return _.contains(ids, ticket.id);
					});

				callback();
			},
			function(err) {
				// wat do
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
			template: require('../../partials/modal-ticketcreate.html'),
			windowClass: 'modal-size-md'
		}

		return modalService.show(modalOptions, null).then(function(result) {
			return $scope.createTicket(result);
		});
	}

	$scope.promptTicketEdit = function(ticket) {
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

	$scope.promptTicketRemove = function(ids, callback) {
		var modalOptions = {
			template: require('../../partials/modal-ticketremove.html'),
			windowClass: 'modal-size-sm'
		}

		var userOptions = {};

		if (ids.length == 1) {
			var ticket = _.find($scope.board.tickets, function(ticket) {
				return ticket.id == ids[0];
			});

			userOptions.ticketName = ticket.heading;
		}

		userOptions.ticketCount = ids.length;

		modalService.show(modalOptions, userOptions).then(function() {
			$scope.removeTickets(ids, callback);
		});
	}

	$scope.editBoard = function(board, attrs) {
		board.name     = attrs.name;
		board.isPublic = attrs.isPublic;

		return board.save().then(
			function(board) {
				console.log('edited', board);
			},
			function(err) {
				// wat do
				console.log(err);
			});
	}

	$scope.promptBoardEdit = function(board) {
		Board.selectedBoard = board;

		var modalOptions = {
			template: require('../../partials/modal-boardedit.html'),
			windowClass: 'modal-size-md',
			controller: require('./modal-boardedit')
		}

		var userOptions = {};

		modalService.show(modalOptions, userOptions).then(function(result) {
			$scope.editBoard(board, result);
		});
	}
}
