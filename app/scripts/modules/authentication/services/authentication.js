'use strict';


module.exports = function($q, $http, Config) {

	var api   = Config.api.url();
	var token = localStorage.getItem('access-token');

	return {

		login: function(user) {
			return $http.post(api + 'auth/login', user)
				.then(function(response) {
					localStorage.setItem('access-token',
						response.headers('x-access-token'));
				});
		},

		logout: function() {
			return $http.post(api + 'auth/logout')
				.then(function() {
					localStorage.removeItem('access-token');
				});
		},

		register: function(user) {
			return $http.post(api + 'auth/register', user);
		},

		getUser: function() {
			return $http.get(api + 'auth').then(function(response) {
				return response.data;
			});
		},

		getToken: function() {
			return token
		},

		setToken: function(token) {
			token = token;
		},

		clear: function() {
			localStorage.removeItem('access-token');
		}
	}
}
