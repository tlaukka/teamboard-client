'use strict';


module.exports = function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
		.state('guestlogin', {
			url: '/board/:id/access/:code',
			template: require('../../partials/guestlogin.html'),
			controller: require('../controllers/guestlogin')
		})

		.state('main', {
			url:      '/main',
			abstract: true,
			template: require('../../partials/main.html')
		})

		.state('main.workspace', {
			url: '/workspace',

			resolve: {
				token: function(authService) {
					return authService.setTokenKey('tb-access-token-user');
				},

				currentUser: function(token, authService) {
					return authService.getUser();
				},

				boards: function(token, $http, Config, boardCollection) {
					return $http.get(Config.api.url() + 'boards')
						.then(function(response) {
							boardCollection.setBoards(response.data);
							return boardCollection.getBoards();
						});
				}
			},

			views: {
				'sidebar': {
					template:   require('../../partials/sidebar.html'),
					controller: require('../controllers/sidebar')
				},

				'topbar': {
					template:   require('../../partials/topbar-workspace.html'),
					controller: require('../controllers/topbar-workspace')
				},

				'content': {
					template:   require('../../partials/workspace.html'),
					controller: require('../controllers/workspace')
				}
			}
		})

		.state('main.board', {
			url: '/board/:id',

			resolve: {
				token: function($http, $stateParams, Config, authService) {
					return authService.setTokenKey('tb-access-token-user');
				},

				resolvedBoard: function(token, $http, $stateParams, Config, Board) {
					return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '')
						.then(function(response) {
								return new Board(response.data);
							},
							function(err) {
								return console.log(err);
							});
				},

				tickets: function(token, $http, $stateParams, Config, ticketCollection) {
					return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '/tickets')
						.then(function(response) {
							ticketCollection.setTickets(response.data);
							return ticketCollection.getTickets();
						},
						function(err) {
							return console.log(err);
						});
				}
			},

			views: {
				// 'sidebar': {
				// 	template:   require('../../partials/sidebar.html'),
				// 	controller: require('../controllers/sidebar')
				// },

				// 'topbar': {
				// 	template:   require('../../partials/topbar-board.html'),
				// 	controller: require('../controllers/topbar-board')
				// },

				'content': {
					resolve: {
						currentUser: function(token, authService) {
							return authService.getUser();
						},

						connectedSocket: function(token, $q, $stateParams, Config, authService) {
							var io       = require('socket.io-client');
							var deferred = $q.defer();

							var socket = io(Config.io.url(), {
								'query':     'access-token=' + authService.getToken() + '',
								'multiplex': false
							});

							socket.on('connect', function() {
								socket.emit('board:join', { 'board': $stateParams.id }, function(err) {
									return err ? deferred.reject(err) : deferred.resolve(socket);
								});
							});

							socket.on('error', deferred.reject);

							return deferred.promise;
						}
					},

					template:   require('../../partials/board.html'),
					controller: require('../controllers/board')
				}
			}
		})

		.state('main.board.guest', {
			url: '/guest',

			resolve: {
				token: function($stateParams, authService) {
					return authService.setTokenKey('tb-access-token-guest-' + $stateParams.id + '');
				},
			}
		})

		.state('main.presentation', {
			url: '/presentation/:id',

			resolve: {
				resolvedBoard: function($http, $stateParams, Config, Board) {
					return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '')
						.then(function(response) {
								return new Board(response.data);
							},
							function(err) {
								return console.log(err);
							});
				},

				tickets: function($http, $stateParams, Config, ticketCollection) {
					return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '/tickets')
						.then(function(response) {
							ticketCollection.setTickets(response.data);
							return ticketCollection.getTickets();
						},
						function(err) {
							return console.log(err);
						});

					// return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '/tickets')
					// 	.then(function(response) {
					// 		var tickets = [];
					// 		for(var i = 0; i < response.data.length; i++) {
					// 			var ticketData = response.data[i];
					// 			ticketData.board = resolvedBoard.id;
					// 			tickets.push(new Ticket(ticketData));
					// 		}

					// 		return tickets;
						// },
						// function(err) {
						// 	return console.log(err);
						// });
				}
			},

			views: {
				'presentation': {
					resolve: {
						currentUser: function(authService) {
							return authService.getUser();
						},

						connectedSocket: function($q, $stateParams, Config, authService) {
							var io = require('socket.io-client');

							var socket = io(Config.io.url(), {
								'query':     'access-token=' + authService.getToken() + '',
								'multiplex': false
							});

							var deferred = $q.defer();

							socket.on('connect', function() {
								socket.emit('board:join', { 'board': $stateParams.id }, function(err) {
									return err ? deferred.reject(err) : deferred.resolve(socket);
								});
							});

							socket.on('error', deferred.reject);

							return deferred.promise;
						}
					},

					template:   require('../../partials/presentation-container.html'),
					controller: require('../controllers/presentation')
				}
			}
		});

	$urlRouterProvider.otherwise('/main/workspace');
	$locationProvider.html5Mode(true);
}
