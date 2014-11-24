'use strict';


var _ = require('lodash');

module.exports = function(
	$scope,
	$rootScope,
	modalService,
	Modal,
	boardCollection
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

	$scope.boards = boardCollection.getBoards();

	$scope.state = {
		isLoadingBoard: false
	};

	$scope.$on('action:create', function() {
		$scope.promptBoardCreate();
	});

	$scope.$on('action:remove', function() {
		$scope.promptBoardRemove();
	});

	$scope.$on('action:edit', function() {
		$scope.promptBoardEdit(boardCollection.getSelectedBoard());
	});

	$scope.validateToolset = function() {
		var selectionCount = boardCollection.getSelectedBoardsCount();

		// Enable/disable necessary toolbar buttons.
		if (selectionCount != 0) {
			$rootScope.$broadcast('ui:enable-remove', true);

			// Enable edit only if a single board is selected.
			if (selectionCount == 1) {
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

	$scope.onWorkspaceClicked = function($event) {
		$event.stopPropagation();
		$scope.removeBoardSelections();
	}

	$scope.toggleBoardSelection = function(id) {
		boardCollection.toggleBoardSelection(id);
		$scope.validateToolset();
	}

	$scope.removeBoardSelections = function() {
		$rootScope.$broadcast('action:select-boards', false);
		boardCollection.clearSelectedBoardIds();
		$scope.validateToolset();
	}

	$scope.createBoard = function(data) {
		boardCollection.addBoard(data);
	}

	$scope.removeSelectedBoards = function() {
		boardCollection.removeSelectedBoards().then(function() {
			$scope.boards = boardCollection.getBoards();
			$scope.removeBoardSelections();
		});
	}

	$scope.promptBoardCreate = function() {
		var options = {
			'template': require('../../partials/modals/create-board.html'),
		}

		Modal.open(null, options).result.then(function(result) {
			return $scope.createBoard(result);
		});
	}

	$scope.promptBoardEdit = function(board) {
		var props = {
			'id':         board.id,
			'name':       board.name,
			'accessCode': board.accessCode,
		}

		var options = {
			'template':   require('../../partials/modals/edit-board.html'),
			'controller': require('./modals/edit-board'),
		}

		Modal.open(props, options).result.then(function(result) {
			return boardCollection.updateBoard(props.id, result);
		});
	}

	$scope.promptBoardRemove = function() {
		var selBoard    = boardCollection.getSelectedBoard();
		var lenSelected = boardCollection.getSelectedBoardsCount();

		var props = {
			'name':  lenSelected > 1 ? '' : selBoard.name,
			'count': lenSelected,
		}

		var options = {
			'template': require('../../partials/modals/remove-board.html'),
		}

		Modal.open(props, options).result.then(function() {
			return $scope.removeSelectedBoards();
		});
	}
}
