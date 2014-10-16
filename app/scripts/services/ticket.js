'use strict';


module.exports = function($http, Config) {

	var _obj = function(ticket) {
		return {
			color:   ticket.color,
			heading: ticket.heading,
			content: ticket.content,
			position: {
				x: ticket.position.x,
				y: ticket.position.y,
				z: ticket.position.z
			}
		}
	}

	var _init = function(response) {
		this.id    = response.data.id;

		return response;
	}

	var _update = function(response) {
		this.color    = response.data.color    || this.color;
		this.heading  = response.data.heading  || this.heading;
		this.content  = response.data.content  || this.content;
		this.position = response.data.position || this.position;

		return this;
	}

	var Ticket = function(data) {
		this.id       = data.id;
		this.board    = data.board;
		this.color    = data.color;
		this.heading  = data.heading;
		this.content  = data.content;
		this.position = data.position;
	}

	Ticket.prototype.save = function() {
		return this.id ? this.update() : this.create();
	}

	Ticket.prototype.create = function() {
		return $http.post(Config.api.url() + 'boards/' + this.board +
				'/tickets', _obj(this))
			.then(_init.bind(this))
			.then(_update.bind(this));
	}

	Ticket.prototype.update = function() {
		return $http.put(Config.api.url() + 'boards/' + this.board +
				'/tickets/' + this.id + '', _obj(this));
	}

	Ticket.prototype.remove = function() {
		return $http.delete(Config.api.url() + 'boards/' + this.board +
			'/tickets/' + this.id + '');
	}

	// helpers

	Ticket.prototype.move = function(pos) {
		return $http.put(Config.api.url() + 'boards/' + this.board +
				'/tickets/' + this.id + '', { position: pos })
			.then(_update.bind(this));
	}

	return Ticket;
}
