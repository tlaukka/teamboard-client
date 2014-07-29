'use strict';


module.exports = function(
		$stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
		.state('main', {
			url:      '/main',
			abstract: true,
			template: require('../../partials/main.html')
		})
		.state('main.workspace', {

			url: '/workspace',

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

					resolve: {

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

					template:   require('../../partials/workspace.html'),
					controller: require('../controllers/workspace')
				}
			}
		})
		.state('main.board', {

			url: '/board/:id',

			resolve: {
				resolvedBoard: function(
						$http, $stateParams, Config, Board) {
					return $http.get(Config.api.url() + 'boards/' +
							$stateParams.id + '')
						.then(
							function(response) {
								return new Board(response.data);
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
						connectedSocket: function(socketService) {
							return socketService.connect().then(
								function(socket) {
									console.log('got socket:', socket);
									return socket;
								},
								function(err) {
									// TODO Handle it?
									console.log('err', err);
								});
						},
						joinRoom: function($q, $stateParams, connectedSocket) {
							var deferred = $q.defer();

							connectedSocket.emit('board:join', {
									board: $stateParams.id
								},
								function(err, res) {

									if(err) {
										// TODO Handle this how?
										console.log('err', err);
										return deferred.reject(err);
									}

									return deferred.resolve(res);
								});

							return deferred.promise;
						}
					},

					template:   require('../../partials/board.html'),
					controller: require('../controllers/board')
				}
			}
		});

	$urlRouterProvider.otherwise('/main/workspace');

	$locationProvider.html5Mode(true);
}
