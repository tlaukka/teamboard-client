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
	boardCollection,
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

	// $scope.boards = boards;
	$scope.boards = boardCollection.getBoards();
	// $scope.selectedBoardIds = [];
	// boardCollection.setBoards(boards);

	$scope.state = {
		isLoadingBoard: false
	};

	$scope.$on('action:create', function() {
		$scope.promptBoardCreate();
	});

	$scope.$on('action:remove', function() {
		// $scope.promptBoardRemove($scope.selectedBoardIds, function() {
		// $scope.promptBoardRemove(boardCollection.getSelectedBoardIds(), function() {
		$scope.promptBoardRemove();//function() {
			// Clear board selections if boards were deleted
			// $scope.removeBoardSelections();
		// });

		// $scope.promptBoardRemove(boardCollection.getSelectedBoardIds(), function() {
		// 	// Clear board selections if boards were deleted
		// 	$scope.removeBoardSelections();
		// });
	});

	$scope.$on('action:edit', function() {
		// var board = _.find($scope.boards, function(board) {
		// 	return board.id == $scope.selectedBoardIds[0];
		// });

		// $scope.promptBoardEdit(board);
		$scope.promptBoardEdit(boardCollection.selectedBoard);
	});

	// // Enable/disable necessary toolbar buttons.
	// $scope.$watch('selectedBoardIds.length', function() {
	// 	if ($scope.selectedBoardIds.length != 0) {
	// 		$rootScope.$broadcast('ui:enable-remove', true);

	// 		// Enable edit only if a single board is selected.
	// 		if ($scope.selectedBoardIds.length == 1) {
	// 			$rootScope.$broadcast('ui:enable-edit', true);
	// 		}
	// 		else {
	// 			$rootScope.$broadcast('ui:enable-edit', false);
	// 		}
	// 	}
	// 	else {
	// 		$rootScope.$broadcast('ui:enable-remove', false);
	// 		$rootScope.$broadcast('ui:enable-edit', false);
	// 	}
	// });

	$scope.onWorkspaceClicked = function($event) {
		$event.stopPropagation();
		$scope.removeBoardSelections();
	}

	$scope.toggleBoardSelection = function(id) {
		// var selectedIndex = $scope.selectedBoardIds.indexOf(id);

		// if (selectedIndex == -1) {
		// 	$scope.selectedBoardIds.push(id);
		// }
		// else {
		// 	$scope.selectedBoardIds.splice(selectedIndex, 1);
		// }

		var result = boardCollection.toggleBoardSelection(id);

		// Enable/disable necessary toolbar buttons.
		if (result != 0) {
			$rootScope.$broadcast('ui:enable-remove', true);

			// Enable edit only if a single board is selected.
			if (result == 1) {
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
	}

	$scope.removeBoardSelections = function() {
		$rootScope.$broadcast('action:select-boards', false);
		// $scope.selectedBoardIds = [];
		boardCollection.clearSelectedBoardIds();
	}

	$scope.validateToolset = function() {
		
	}

	$scope.createBoard = function(data) {
		boardCollection.addBoard(data);
		// new Board(data).save().then(
		// 	function(board) {
		// 		$scope.boards.push(board);
		// 	},
		// 	function(err) {
		// 		// Wat do
		// 		console.log(err);
		// 	});
	}

	// $scope.removeBoard = function(id) {
	// 	var filter = function(board) { return board.id === id }
	// 	var board  = _.find($scope.boards, filter);

	// 	if(board) {
	// 		return board.remove();
	// 	}
	// }

	// $scope.removeSelectedBoards = function(callback) {
	$scope.removeSelectedBoards = function() {
		boardCollection.removeSelectedBoards();
		// var promises = [];

		// for (var i = 0; i < ids.length; i++) {
		// 	 promises.push($scope.removeBoard(ids[i]));
		// }

		// $q.all(promises).then(
		// 	function() {
		// 		$scope.boards = _.reject($scope.boards,
		// 			function(board) {
		// 				return _.contains(ids, board.id);
		// 			});

		// 		callback();
		// 	},
		// 	function(err) {
		// 		// wat do
		// 		console.log(err);
		// 	});
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
		// Board.selectedBoard = board;
		boardCollection.setSelectedBoard(board);

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

	$scope.promptBoardRemove = function(callback) {
		var modalOptions = {
			template: require('../../partials/modal-boardremove.html'),
			windowClass: 'modal-size-sm'
		};

		var userOptions = {};

		if (boardCollection.getSelectedBoardsCount() == 1) {

			// var board = _.find($scope.boards, function(board) {
			// 	return board.id == ids[0];
			// });

			// userOptions.boardName = board.name;
			// var boardId = boardCollection.getSelectedBoardIds()[0];
			// userOptions.boardName = boardCollection.findBoard(boardId);
			userOptions.boardName = boardCollection.getSelectedBoard().name;
		}

		// userOptions.boardCount = ids.length;
		userOptions.boardCount = boardCollection.getSelectedBoardsCount();
console.log(userOptions.boardName + ', ' + userOptions.boardCount);
		modalService.show(modalOptions, userOptions).then(function() {
			// $scope.removeSelectedBoards(ids, callback);
			$scope.removeSelectedBoards();
		});
	}
}
