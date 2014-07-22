'use strict';


module.exports = function($q, Config, authService) {

	var _io     = require('socket.io-client');
	var _socket = null;

	return {

		connect: function() {

			var token    = authService.getToken();
			var deferred = $q.defer();

			if(_socket && _socket.connected) {
				console.log('socket: already connected');
				deferred.resolve(this);
				return deferred.promise;
			}

			_socket = _io(Config.io.url(), {
				query:     'access-token=' + token,
				multiplex: false
			});

			var self = this;

			_socket.on('connect', function() {
				console.log('socket: connection established');
				return deferred.resolve(self);
			});

			_socket.on('error',         deferred.reject);
			_socket.on('connect_error', deferred.reject);

			return deferred.promise;
		},

		on: function(ev, cb) {
			_socket.on(ev, cb);
		},

		off: function(ev, cb) {
			_socket.off(ev, cb);
		},

		emit: function(ev, data, cb) {
			_socket.emit(ev, data, cb);
		}
	}
}
