'use strict';


module.exports = function($q, $http, Config) {

	var api = Config.api.url();
	var _token = null;

	return {

		login: function(user) {
			return $http.post(api + 'auth/login', user)
				.then(function(response) {
					var token = response.headers('x-access-token');
					console.log(token);
					localStorage.setItem(Config.userKey, JSON.stringify(response.data));
					localStorage.setItem(Config.tokenKey, token);
				});
		},

		logout: function() {
			return $http.post(api + 'auth/logout')
				.then(function() {
					localStorage.removeItem(Config.userKey);
					localStorage.removeItem(Config.tokenKey);
				});
		},

		register: function(user) {
			return $http.post(api + 'auth/register', user);
		},

		getUser: function() {
			var user     = JSON.parse(localStorage.getItem(Config.userKey));
			var deferred = $q.defer();

			if(!user) {
				var onUser = function(response) {
					localStorage.setItem(Config.userKey, JSON.stringify(response.data));
					deferred.resolve(response.data);
				}
				$http.get(api + 'auth')
					.then(onUser, deferred.reject);
			}
			else {
				deferred.resolve(user);
			}

			return deferred.promise;
		},

		getToken: function() {
			return _token
		},

		setToken: function(token) {
			_token = token;
		},

		// getToken: function() {
		// 	return localStorage.getItem(Config.tokenKey);
		// },

		clear: function() {
			localStorage.removeItem(Config.userKey);
			localStorage.removeItem(Config.tokenKey);
		}
	}
}
