'use strict';


module.exports = function($q, $http, Config) {

	var _api = Config.api.url();

	return {

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

		register: function(user) {
			return $http.post(_api + 'auth/register', user);
		},

		getUser: function() {
			return $http.get(_api + 'auth').then(function(response) {
				return response.data;
			});
		},

		getToken: function() {
			return localStorage.getItem('access-token');
		},

		setToken: function(token) {
			localStorage.setItem('access-token', token);
		},

		clear: function() {
			localStorage.removeItem('access-token');
		}
	}
}
