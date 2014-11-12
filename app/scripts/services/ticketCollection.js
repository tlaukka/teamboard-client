'use strict';


var _ = require('underscore');

module.exports = function($q, Ticket) {
	var ticketCollection = {};

	var _selectedTicket = null;
	var _selectedTicketIds = [];
	var _tickets = [];

	ticketCollection.getSelectedTicket = function() {
		return _selectedTicket;
	}

	ticketCollection.setSelectedTicket = function(ticket) {
		_selectedTicket = ticket;
	}

	ticketCollection.getSelectedTicketIds = function() {
		return _selectedTicketIds;
	}

	ticketCollection.getSelectedTicketsCount = function() {
		return _selectedTicketIds.length;
	}

	ticketCollection.getTickets = function() {
		return _tickets;
	}

	ticketCollection.setTickets = function(tickets) {
		_tickets = _.map(tickets, function(ticket) {
			return new Ticket(ticket);
		});
	}

	ticketCollection.findTicket = function(id) {
		return _.find(_tickets, function(ticket) {
			return ticket.id == id;
		});
	}

	ticketCollection.clearSelectedTicketIds = function() {
		_selectedTicketIds = [];
	}

	ticketCollection.toggleTicketSelection = function(ticketId) {
		var selectedIndex = _selectedTicketIds.indexOf(ticketId);

		if (selectedIndex == -1) {
			_selectedTicketIds.push(ticketId);
		}
		else {
			_selectedTicketIds.splice(selectedIndex, 1);
		}

		if (_selectedTicketIds.length == 1) {
			_selectedTicket = ticketCollection.findTicket(_selectedTicketIds[0]);
		}
	}

	ticketCollection.addTicket = function(data) {
		var ticket = new Ticket(data);
		return ticket.save().then(
			function(ticket) {
				_tickets.push(ticket);
			},
			function(err) {
				// Wat do
				console.log(err);
			});
	}

	ticketCollection.addTicketLocal = function(data) {
		var ticket = new Ticket(data);
		_tickets.push(ticket);
	}

	ticketCollection.updateTicket = function(id, attrs) {
		var ticket = ticketCollection.findTicket(id);
		ticket.heading = attrs.heading;
		ticket.content = attrs.content;
		ticket.color = attrs.color;
		return ticket.save();
	}

	var _removeTicket = function(id) {
		var ticket = ticketCollection.findTicket(id);

		if(ticket) {
			return ticket.remove();
		}
	}

	ticketCollection.removeTicketLocal = function(id) {
		_tickets = _.reject(_tickets, function(ticket) {
			return ticket.id == id;
		});
	}

	ticketCollection.removeSelectedTickets = function() {
		var promises = [];

		for (var i = 0; i < ticketCollection.getSelectedTicketsCount(); i++) {
			 promises.push(_removeTicket(_selectedTicketIds[i]));
		}

		return $q.all(promises).then(
			function() {
				_tickets = _.reject(_tickets, function(ticket) {
					return _.contains(_selectedTicketIds, ticket.id);
				});

				ticketCollection.clearSelectedTicketIds();
			},
			function(err) {
				// wat do
				console.log(err);
			});
	}

	return ticketCollection;
}

