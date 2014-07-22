'use strict';


module.exports = function($httpProvider, $stateProvider) {

	// add the access-token to all http requests
	$httpProvider.interceptors.push(require('./services/http-interceptor'));

	// provide various states for the application
	$stateProvider
		.state('login', {
			url:         '/login',
			template:    require('./partials/login.html'),
			controller:  require('./controllers/login')
		})
		.state('register', {
			url:         '/register',
			template:    require('./partials/register.html'),
			controller:  require('./controllers/register')
		});
}
