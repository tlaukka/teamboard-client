'use strict';


var _ = require('underscore');

module.exports = function(
	$scope,
	$rootScope,
	$http,
	$q,
	$speechRecognition,
	modalService,
	Config,
	Board,
	boards,
	currentUser
	) {

	// var tasks = {
	// 	'createBoard': {
	// 		regex: /^create .+/gi,
	// 		lang: 'en-US',
	// 		call: function(e) {
	// 			$scope.createBoard({
	// 				'name': e.split(' ').slice(1).join(' ')
	// 			});
	// 		}
	// 	}
	// }

	// $speechRecognition.onerror(function(e) {
	// 	console.error('Voice controls disabled.', e);
	// });

	// $speechRecognition.onstart(function() {
	// 	console.debug('Voice controls enabled!');
	// 	$speechRecognition.listenUtterance(tasks['createBoard']);
	// });

	// $speechRecognition.listen();

	$scope.boards = boards;
	$scope.selectedBoardIds = [];

	$scope.state = {
		isLoadingBoard: false
	};

	$scope.$on('action:create', function() {
		$scope.promptBoardCreate();
	});

	$scope.$on('action:remove', function() {
		$scope.promptBoardRemove($scope.selectedBoardIds, function() {
			// Clear board selections if boards were deleted
			$scope.removeBoardSelections();
		});
	});

	$scope.$on('action:edit', function() {
		var board = _.find($scope.boards, function(board) {
			return board.id == $scope.selectedBoardIds[0];
		});

		$scope.promptBoardEdit(board);
	});

	// Enable/disable necessary toolbar buttons.
	$scope.$watch('selectedBoardIds.length', function() {
		if ($scope.selectedBoardIds.length != 0) {
			$rootScope.$broadcast('ui:enable-remove', true);

			// Enable edit only if a single board is selected.
			if ($scope.selectedBoardIds.length == 1) {
				$rootScope.$broadcast('ui:enable-edit', true);
			}
			else {
				$rootScope.$broadcast('ui:enable-edit', false);
			}
		}
		else {
			$rootScope.$broadcast('ui:enable-remove', false);
			$rootScope.$broadcast('ui:enable-edit', false);
		}
	});

	$scope.onWorkspaceClicked = function($event) {
		$event.stopPropagation();
		$scope.removeBoardSelections();
	}

	$scope.onBoardPreviewClicked = function($event) {
		$event.stopPropagation();
	}

	$scope.toggleBoardSelection = function(id) {
		var selectedIndex = $scope.selectedBoardIds.indexOf(id);

		if (selectedIndex == -1) {
			$scope.selectedBoardIds.push(id);
		}
		else {
			$scope.selectedBoardIds.splice(selectedIndex, 1);
		}
	}

	$scope.removeBoardSelections = function() {
		$scope.selectedBoardIds = [];
	}

	$scope.createBoard = function(data) {
		new Board(data).save().then(
			function(board) {
				$scope.boards.push(board);
			},
			function(err) {
				// Wat do
				console.log(err);
			});
	}

	$scope.removeBoard = function(id) {
		var filter = function(board) { return board.id === id }
		var board  = _.find($scope.boards, filter);

		if(board) {
			return board.remove();
		}
	}

	$scope.removeBoards = function(ids, callback) {
		var promises = [];

		for (var i = 0; i < ids.length; i++) {
			 promises.push($scope.removeBoard(ids[i]));
		}

		$q.all(promises).then(
			function() {
				$scope.boards = _.reject($scope.boards,
					function(board) {
						return _.contains(ids, board.id);
					});

				callback();
			},
			function(err) {
				// wat do
				console.log(err);
			});
	}

	$scope.editBoard = function(board, attrs) {
		board.name = attrs.name;

		return board.save().then(
			function(board) {
				console.log('edited', board);
			},
			function(err) {
				// wat do
				console.log(err);
			});
	}

	$scope.promptBoardCreate = function() {
		var modalOptions = {
			template: require('../../partials/modal-boardcreate.html'),
			windowClass: 'modal-size-md'
		};

		var userOptions = {};

		modalService.show(modalOptions, userOptions).then(function(result) {
			$scope.createBoard(result);
		});
	}

	$scope.promptBoardEdit = function(board) {
		Board.selectedBoard = board;

		var modalOptions = {
			template: require('../../partials/modal-boardedit.html'),
			windowClass: 'modal-size-md',
			controller: require('./modal-boardedit')
		};

		var userOptions = {};

		modalService.show(modalOptions, userOptions).then(function(result) {
			$scope.editBoard(board, result);
		});
	}

	$scope.promptBoardRemove = function(ids, callback) {
		var modalOptions = {
			template: require('../../partials/modal-boardremove.html'),
			windowClass: 'modal-size-sm'
		};

		var userOptions = {};

		if (ids.length == 1) {
			var board = _.find($scope.boards, function(board) {
				return board.id == ids[0];
			});

			userOptions.boardName = board.name;
		}

		userOptions.boardCount = ids.length;

		modalService.show(modalOptions, userOptions).then(function() {
			$scope.removeBoards(ids, callback);
		});
	}
}
