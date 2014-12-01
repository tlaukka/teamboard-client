'use strict';


var _ = require('lodash');

module.exports = function($q, Board) {
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
		return _selectedBoardIds;
	}

	boardCollection.getSelectedBoardsCount = function() {
		return _selectedBoardIds.length;
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
			_selectedBoard = boardCollection.findBoard(_selectedBoardIds[0]);
		}
		else {
			_selectedBoard = null;
		}
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

	boardCollection.updateBoard = function(id, attrs) {
		var board = boardCollection.findBoard(id);
		board.name = attrs.name;
		return board.save();
	}

	var _removeBoard = function(id) {
		var board = boardCollection.findBoard(id);

		if(board) {
			return board.remove();
		}
	}

	boardCollection.removeSelectedBoards = function() {
		var promises = [];

		for (var i = 0; i < boardCollection.getSelectedBoardsCount(); i++) {
			 promises.push(_removeBoard(_selectedBoardIds[i]));
		}

		return $q.all(promises).then(
			function() {
				_boards = _.reject(_boards, function(board) {
					return _.contains(_selectedBoardIds, board.id);
				});

				boardCollection.clearSelectedBoardIds();
			},
			function(err) {
				// wat do
				console.log(err);
			});
	}

	return boardCollection;
}
