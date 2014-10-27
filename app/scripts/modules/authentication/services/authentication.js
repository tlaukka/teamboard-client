'use strict';


module.exports = function($q, $http, Config) {

	var _api = Config.api.url();
	var _tokenKey = 'tb-access-token-user';

	return {
		loginUser: function(user) {
			var self = this;

			return $http.post(_api + 'auth/login', user)
				.then(function(response) {
					var token = response.headers('x-access-token');
					self.setUserToken(token);
				});
		},

		loginGuest: function(boardId, accessCode, username) {
			var self = this;

			return $http.post(_api + 'boards/' + boardId + '/access/' + accessCode, { username: username })
				.then(function(response) {
					var token = response.headers('x-access-token')
					self.setGuestToken(boardId, token);
				});
		},

		logout: function() {
			var self = this;

			return $http.post(_api + 'auth/logout')
				.then(function() {
					self.removeToken();
				});
		},

		register: function(user) {
			return $http.post(_api + 'auth/register', user);
		},

		getUser: function() {
			return $http.get(_api + 'auth').then(function(response) {
				return response.data;
			});
		},

		getTokenKey: function() {
			return _tokenKey;
		},

		setTokenKey: function(tokenKey) {
			_tokenKey = tokenKey;
		},

		getToken: function() {
			return localStorage.getItem(_tokenKey);
		},

		setUserToken: function(token) {
			localStorage.setItem('tb-access-token-user', token);
		},

		setGuestToken: function(boardId, token) {
			localStorage.setItem('tb-access-token-guest-' + boardId, token);
		},

		removeToken: function() {
			console.log(_tokenKey);
			localStorage.removeItem(_tokenKey);
		}
	}
}
