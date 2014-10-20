'use strict';


module.exports = function($http, Config, Ticket) {

	var selectedBoard = null;

	var _obj = function(board) {
		return {
			name:        board.name,
			description: board.description,
			size:        board.size,
			background:  board.background,
			createdBy:   board.createdBy,
			accessCode:  board.accessCode
		}
	}

	var _init = function(response) {
		this.id         = response.data.id;
		this.createdBy  = response.data.createdBy;

		return response;
	}

	var _update = function(response) {
		this.name       = response.data.name       || this.name;
		this.size       = response.data.size       || this.size;
		this.background = response.data.background || this.background;
		this.createdBy  = response.data.createdBy  || this.createdBy;
		this.accessCode = response.data.accessCode || this.accessCode;

		return this;
	}

	var Board = function(data) {

		this.id         = data.id;
		this.name       = data.name;
		this.size       = data.size;
		this.background = data.background;
		this.createdBy  = data.createdBy;
		this.accessCode = data.accessCode;
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

	Board.prototype.grantGuestAccess = function() {
		return $http.post(Config.api.url() + 'boards/' + this.id + '/access')
			.then(_update.bind(this));
	}

	Board.prototype.revokeGuestAccess = function() {
		return $http.delete(Config.api.url() + 'boards/' + this.id + '/access')
			.then(_update.bind(this));
	}

	return Board;
}
