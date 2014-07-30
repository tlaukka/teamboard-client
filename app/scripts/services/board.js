'use strict';


module.exports = function($http, Config, Ticket) {

	var _obj = function(board) {
		return {
			name:       board.name,
			info:       board.info,
			isPublic:   board.isPublic
		}
	}

	var _init = function(response) {
		this.id    = response.data.id;
		this.owner = response.data.owner;

		return response;
	}

	var _update = function(response) {
		this.name       = response.data.name     || this.name;
		this.info       = response.data.info     || this.info;
		this.isPublic   = response.data.isPublic || this.isPublic;

		this.guests  = response.data.guests  || this.guests;
		this.members = response.data.members || this.members;

		if(response.data.tickets) {
			this.tickets = _makeTickets(response.data.tickets, this.id);
		}

		return this;
	}

	var _makeTickets = function(raw, board) {
		var tickets = [ ];

		if(!raw) {
			return tickets;
		}

		for(var i = 0; i < raw.length; i++) {
			var ticketData       = raw[i];
				ticketData.board = board;
			tickets.push(new Ticket(ticketData));
		}

		return tickets;
	}

	var Board = function(data) {

		this.id    = data.id;
		this.owner = data.owner;

		this.name     = data.name;
		this.info     = data.info;
		this.isPublic = data.isPublic;

		this.screenshot = Config.api.url() + 'boards/' + this.id +
			'/screenshot';

		this.guests  = data.guests  || [ ];
		this.members = data.members || [ ];
		this.tickets = _makeTickets(data.tickets, this.id);
	}

	Board.prototype.save = function() {
		return this.id ? this.update() : this.create(_obj(this));
	}

	Board.prototype.create = function(data) {
		return $http.post(Config.api.url() + 'boards', data)
			.then(_init.bind(this))
			.then(_update.bind(this));
	}

	Board.prototype.update = function() {
		return $http.put(Config.api.url() + 'boards/' + this.id, _obj(this))
			.then(_update.bind(this));
	}

	Board.prototype.remove = function() {
		return $http.delete(Config.api.url() + 'boards/' + this.id);
	}

	return Board;
}
