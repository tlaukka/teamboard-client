'use strict';


var _ = require('lodash');

module.exports = function(
	$scope,
	$rootScope,
	modalService,
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
		var modalOptions = {
			template: require('../../partials/modal-boardedit.html'),
			windowClass: 'modal-size-md',
			controller: require('./modal-boardedit')
		};

		var userOptions = {};

		modalService.show(modalOptions, userOptions).then(function(result) {
			boardCollection.updateBoard(board.id, result);
		});
	}

	$scope.promptBoardRemove = function(callback) {
		var modalOptions = {
			template: require('../../partials/modal-boardremove.html'),
			windowClass: 'modal-size-sm'
		};

		var userOptions = {};

		if (boardCollection.getSelectedBoardsCount() == 1) {
			userOptions.boardName = boardCollection.getSelectedBoard().name;
		}

		userOptions.boardCount = boardCollection.getSelectedBoardsCount();

		modalService.show(modalOptions, userOptions).then(function() {
			$scope.removeSelectedBoards();
		});
	}
}
