'use strict';


module.exports = function($scope, $rootScope, modalService, Board, boards, scrollArea) {

	// 'boards' is a resolved parameter
	$scope.boards = boards;
	$scope.selectedBoards = [];

	$scope.state = {
		isLoadingBoard: false
	};

	console.log('workspace: resolved boards', boards);

	$scope.$on('action:create', function() {
		$scope.promptBoardCreate();
	});

	$scope.$on('action:remove', function() {
		$scope.removeBoards($scope.selectedBoards);
		$scope.selectedBoards.length = 0;
	});

	$scope.$on('action:edit', function() {
		var board = $scope.boards[$scope.selectedBoards[0]];
		$scope.editBoard(board);
	});

	// Enable/disable necessary toolbar buttons.
	$scope.$watch('selectedBoards.length', function() {
		if ($scope.selectedBoards.length != 0) {
			$rootScope.$broadcast('ui:enable-remove', true);

			// Enable edit only if a single board is selected.
			if ($scope.selectedBoards.length == 1) {
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

	$scope.toggleBoardSelection = function(index) {
		var selectedIndex = $scope.selectedBoards.indexOf(index);

		if (selectedIndex == -1) {
			$scope.selectedBoards.push(index);
		}
		else {
			$scope.selectedBoards.splice(selectedIndex, 1);
		}
	}

	$scope.createBoard = function(data) {
		new Board(data).save().then(
			function(board) {
				$scope.boards.push(board);
			},
			function(err) {
				// wat do
				console.log(err);
			});
	}

	$scope.removeBoard = function(id) {
		var _      = require('underscore');
		var filter = function(board) { return board.id === id }
		var board  = _.find($scope.boards, filter);

		if(board) {
			board.remove().then(
				function() {
					$scope.boards = _.reject($scope.boards, filter);
				},
				function(err) {
					// wat do
					console.log(err);
				});
		}
	}

	$scope.removeBoards = function(indexes) {
		for (var i = 0; i < indexes.length; i++) {
			var boardId = $scope.boards[indexes[i]].id;
			$scope.removeBoard(boardId);
		}
	}

	$scope.editBoard = function(board, attrs) {
		board.name     = attrs.heading;
		board.isPublic = attrs.isPublic;

		return board.save().then(
			function(board) {
				console.log('edited', board);
			},
			function(err) {
				// wat do
				console.log(err);
			});


		// var modalOptions = {
		// 	template: require('../../partials/modal-boardedit.html')
		// }

		// var userOptions = {
		// 	heading:  board.name,
		// 	isPublic: board.isPublic
		// }

		// modalService.show(modalOptions, userOptions).then(function(result) {

		// 	board.name     = result.heading;
		// 	board.isPublic = result.isPublic;

		// 	board.save().then(
		// 		function(board) {
		// 			console.log('edited', board);
		// 		},
		// 		function(err) {
		// 			// wat do
		// 			console.log(err);
		// 		});
		// });
	}

	$scope.promptBoardCreate = function() {
		var modalOptions = {
			template: require('../../partials/modal-boardcreate.html')
		}

		modalService.show(modalOptions, null).then(function(result) {
			$scope.createBoard(result);
		});
	}

	$scope.promptBoardEdit = function(board) {
		var modalOptions = {
			template: require('../../partials/modal-boardedit.html')
		}

		var userOptions = {
			heading:  board.name,
			isPublic: board.isPublic
		}

		modalService.show(modalOptions, userOptions).then(function(result) {
			$scope.editBoard(board, result);
		});
	}

	$scope.promptBoardRemove = function(board) {
		var modalOptions = {
			template: require('../../partials/modal-boardremove.html')
		}

		var userOptions = {
			boardName:      board.name,
			screenshotPath: board.screenshot
		}

		modalService.show(modalOptions, userOptions).then(function() {
			$scope.removeBoard(board.id);
		});
	}
}
