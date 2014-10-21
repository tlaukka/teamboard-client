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
					// self.setTokenKey('tb-access-token-user');
				});
		},

		loginGuest: function(boardId, accessCode, username) {
			var self = this;

			return $http.post(_api + 'boards/' + boardId + '/access/' + accessCode, { username: username })
				.then(function(response) {
					var token = response.headers('x-access-token')
					self.setGuestToken(boardId, token);
					// self.setTokenKey('tb-access-token-guest-' + boardId);
				});
		},

		login: function(user) {
			return $http.post(_api + 'auth/login', user)
				.then(function(response) {
					localStorage.setItem('access-token',
						response.headers('x-access-token'));
				});
		},

		logout: function() {
			return $http.post(_api + 'auth/logout')
				.then(function() {
					localStorage.removeItem('access-token');
				});
		},

		logoutUser: function() {
			return $http.post(_api + 'auth/logout')
				.then(function() {
					removeUserToken();
				});
		},

		logoutGuest: function(boardId) {
			removeGuestToken(boardId);
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
			// return localStorage.getItem('access-token');
			return localStorage.getItem(_tokenKey);
		},

		getUserToken: function() {
			return localStorage.getItem('tb-access-token-user');
		},

		getGuestToken: function(boardId) {
			return localStorage.getItem('tb-access-token-guest-' + boardId);
		},

		setToken: function(token) {
			localStorage.setItem('access-token', token);
		},

		setUserToken: function(token) {
			localStorage.setItem('tb-access-token-user', token);
		},

		setGuestToken: function(boardId, token) {
			localStorage.setItem('tb-access-token-guest-' + boardId, token);
		},

		removeUserToken: function() {
			localStorage.removeItem('tb-access-token-user');
		},

		removeGuestToken: function(boardId) {
			localStorage.removeItem('tb-access-token-guest-' + boardId);
		},

		clear: function() {
			localStorage.removeItem('access-token');
		}
	}
}
