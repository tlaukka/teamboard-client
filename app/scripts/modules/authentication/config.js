'use strict';


module.exports = function($httpProvider, $stateProvider) {

	// Add authentication to HTTP requests.
	$httpProvider.interceptors.push(require('./services/http-interceptor'));

	$stateProvider

		/**
		 * Login screen.
		 */
		.state('login', {
			url:         '/login',
			template:    require('./partials/login.html'),
			controller:  require('./controllers/login')
		})

		/**
		 * Register screen.
		 */
		.state('register', {
			url:         '/register',
			template:    require('./partials/register.html'),
			controller:  require('./controllers/register')
		});
}
