'use strict';


var _ = require('underscore');

module.exports = function($scope, $rootScope, $http, modalService, Config, Board, boards, currentUser, scrollArea) {

	// 'boards' is a resolved parameter
	$scope.user = currentUser;
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
			$scope.selectedBoardIds.length = 0;
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

	$scope.toggleBoardSelection = function(id) {
		var selectedIndex = $scope.selectedBoardIds.indexOf(id);

		if (selectedIndex == -1) {
			$scope.selectedBoardIds.push(id);
		}
		else {
			$scope.selectedBoardIds.splice(selectedIndex, 1);
		}
	}

	$scope.removeBoardSelections = function($event) {
		$event.stopPropagation();
		$rootScope.$broadcast('action:select-boards', false);
		$scope.selectedBoardIds.length = 0;
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

	$scope.removeBoards = function(ids, callback) {
		Board.remove(ids).then(
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
		board.name     = attrs.name;
		board.isPublic = attrs.isPublic;

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

		var userOptions = {
			owner: $scope.user
		};

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
