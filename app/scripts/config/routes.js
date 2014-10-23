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
				currentUser: function(authService) {
					return authService.getUser();
				},

				// transform boards from http request into Board models
				// so they can have some more functionality
				boards: function($http, Config, Board) {
					var _ = require('underscore');

					return $http.get(Config.api.url() + 'boards')
						.then(function(response) {
							var boards = response.data;

							return _.map(boards, function(board) {
								return new Board(board);
							});
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
				resolveUser: function($http, $stateParams, Config, authService) {
					var _ = require('underscore');

					if (authService.getToken() == undefined) {
						authService.setTokenKey('tb-access-token-guest-' + $stateParams.id);
					}
					else {
						// Check user type (guest or user)
						return $http.get(Config.api.url() + 'boards')
							.then(function(response) {
								var boards = response.data;
								var result = _.find(boards, function(board) {
									return board.id == $stateParams.id;
								});

								if (result == undefined) {
									authService.setTokenKey('tb-access-token-guest-' + $stateParams.id);
								}
							});
					}
				},

				resolvedBoard: function($http, $stateParams, Config, Board) {
					return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '')
						.then(
							function(response) {
								return new Board(response.data);
							},
							function(err) {
								// TODO Handle it?
								console.log('err', err);
							});
				},

				tickets: function($http, $stateParams, Config, Ticket, resolvedBoard) {
					return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '/tickets')
						.then(function(response) {
							var tickets = [];
							for(var i = 0; i < response.data.length; i++) {
								var ticketData = response.data[i];
								ticketData.board = resolvedBoard.id;
								tickets.push(new Ticket(ticketData));
							}

							return tickets;
						},
						function(err) {
							// TODO Handle it?
							console.log('err', err);
						});
				}
			},

			views: {
				'sidebar': {
					template:   require('../../partials/sidebar.html'),
					controller: require('../controllers/sidebar')
				},

				'topbar': {
					template:   require('../../partials/topbar-board.html'),
					controller: require('../controllers/topbar-board')
				},

				'content': {
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

					template:   require('../../partials/board.html'),
					controller: require('../controllers/board')
				}
			}
		})

		.state('main.presentation', {
			url: '/presentation/:id',

			resolve: {
				resolvedBoard: function($http, $stateParams, Config, Board) {
					return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '')
						.then(
							function(response) {
								return new Board(response.data);
							},
							function(err) {
								// TODO Handle it?
								console.log('err', err);
							});
				},

				tickets: function($http, $stateParams, Config, Ticket, resolvedBoard) {
					return $http.get(Config.api.url() + 'boards/' + $stateParams.id + '/tickets')
						.then(function(response) {
							var tickets = [];
							for(var i = 0; i < response.data.length; i++) {
								var ticketData = response.data[i];
								ticketData.board = resolvedBoard.id;
								tickets.push(new Ticket(ticketData));
							}

							return tickets;
						},
						function(err) {
							// TODO Handle it?
							console.log('err', err);
						});
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
