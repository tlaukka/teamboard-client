'use strict';


var _ = require('underscore');

module.exports = function(Board) {
	var boardCollection = {};

	var _selectedBoard = null;
	var _selectedBoardIds = [];
	var _boards = [];

	boardCollection.getSelectedBoard = function() {
		return _selectedBoard;
	}

	boardCollection.setSelectedBoard = function(board) {
		_selectedBoard = board;
	}

	boardCollection.getSelectedBoardIds = function() {
		return _selectedBoard;
	}

	boardCollection.getSelectedBoardsCount = function() {
		return _selectedBoard.length;
	}

	boardCollection.getBoards = function() {
		return _boards;
	}

	boardCollection.setBoards = function(boards) {
		_boards = _.map(boards, function(board) {
			return new Board(board);
		});
	}

	boardCollection.findBoard = function(id) {
		return _.find(_boards, function(board) {
			return board.id == id;
		});
	}

	boardCollection.clearSelectedBoardIds = function() {
		_selectedBoardIds = [];
	}

	boardCollection.toggleBoardSelection = function(boardId) {
		var selectedIndex = _selectedBoardIds.indexOf(boardId);

		if (selectedIndex == -1) {
			_selectedBoardIds.push(boardId);
		}
		else {
			_selectedBoardIds.splice(selectedIndex, 1);
		}

		if (_selectedBoardIds.length == 1) {
			_selectedBoard = _.find(_boards, function(board) {
				return board.id == _selectedBoardIds[0];
			});
		}

		return _selectedBoardIds.length;
	}

	boardCollection.addBoard = function(data) {
		var board = new Board(data);
		board.save().then(
			function(board) {
				_boards.push(board);
			},
			function(err) {
				// Wat do
				console.log(err);
			});
	}

	var _removeBoard = function(id) {
		var board  = _.find(_boards, function(board) {
			return board.id === id;
		});

		if(board) {
			return board.remove();
		}
	}

	boardCollection.removeSelectedBoards = function() {
		var promises = [];

		for (var i = 0; i < ids.length; i++) {
			 promises.push(_removeBoard(ids[i]));
		}

		$q.all(promises).then(
			function() {
				_.boards = _.reject(_.boards,
					function(board) {
						return _.contains(ids, board.id);
					});

				callback();
			},
			function(err) {
				// wat do
				console.log(err);
			});

		boardCollection.clearSelectedBoardIds();
	}

	return boardCollection;
}
