'use strict';


/**
 * Injects the 'access-token' from 'authService' into each HTTP request.
 *   'Authorization': 'Bearer <token>'
 * Redirects to 'login' state when response has status of 401.
 */
module.exports = function($q, $injector, Config) {

	return {

		request: function(reqcfg) {
			var auth  = $injector.get('authService');
			var token = auth.getToken();

			if(token) {
				reqcfg.headers.authorization = 'Bearer ' + token + '';
			}

			return reqcfg;
		},

		responseError: function(res) {
			if(res.status == 401) {
				$injector.get('$state').go(Config.states.login);
			}

			return $q.reject(res);
		}
	}
}
