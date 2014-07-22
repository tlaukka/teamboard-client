'use strict';


module.exports = function($scope, modalService, Board, boards) {

	// 'boards' is a resolved parameter
	$scope.boards = boards;

	console.log('workspace: resolved boards', boards);

	$scope.$on('workspace:create-board', function() {
		$scope.promptBoardCreate();
	});

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
			console.log(board);
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

	$scope.editBoard = function(board) {
		var modalOptions = {
			template: require('../../partials/modal-boardedit.html')
		}

		var userOptions = {
			heading:  board.name,
			isPublic: board.isPublic
		}

		modalService.show(modalOptions, userOptions).then(function(result) {

			board.name     = result.heading;
			board.isPublic = result.isPublic;

			board.save().then(
				function(board) {
					console.log('edited', board);
				},
				function(err) {
					// wat do
					console.log(err);
				});
		});
	}

	$scope.promptBoardCreate = function() {
		var modalOptions = {
			template: require('../../partials/modal-boardcreate.html')
		}

		modalService.show(modalOptions, null).then(function(result) {
			$scope.createBoard(result);
		});
	}

	$scope.promptBoardRemove = function(board) {
		var modalOptions = {
			template: require('../../partials/modal-boardremove.html')
		}

		var userOptions = {
			boardName:      board.name,
			screenshotPath: board.screenshotUrl
		}

		modalService.show(modalOptions, userOptions).then(function() {
			$scope.removeBoard(board.id);
		});
	}
}
