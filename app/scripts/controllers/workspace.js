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

	console.log('workspace: resolved boards', boards);

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
			members: [$scope.user]
		};

		modalService.show(modalOptions, userOptions).then(function(result) {
			$scope.createBoard(result);
		});
	}

	// function getUsers() {
	// 	return $http.get(Config.api.url() + 'users')
	// 		.then(function(res) {

	// 			var users = [];

	// 			angular.forEach(res.data, function(user) {
	// 				users.push(user);
	// 			});

	// 			return users;
	// 		});
	// }

	$scope.promptBoardEdit = function(board) {

		var controller = function($scope, $modalInstance) {

			$scope.board = board;
			$scope.members = [board.owner].concat(board.members);
			$scope.isMemberViewCollapsed = false;
			$scope.isMemberDetailsVisible = false;
			$scope.selectedMember = null;
console.log(board);
// console.log($scope.members);
			$scope.users = [];
			$http.get(Config.api.url() + 'users')
				.then(function(res) {

					var users = [];

					res.data.forEach(function(user) {
						users.push(user);
					});

					$scope.users = users;
				});


			$scope.toggleMemberView = function() {
				$scope.isMemberViewCollapsed = !$scope.isMemberViewCollapsed;

				if ($scope.isMemberViewCollapsed) {
					$scope.hideMemberDetails();
				}
			}

			$scope.showMemberDetails = function(member) {
				$scope.selectedMember = member;
				$scope.isMemberDetailsVisible = true;
			}

			$scope.hideMemberDetails = function() {
				$scope.selectedMember = null;
				$scope.isMemberDetailsVisible = false;
			}

			$scope.removeSelectedMember = function() {
				var member = _.find($scope.members, function(user) {
					return user.email === $scope.selectedMember.email;
				});

				// var memberIndex = $scope.members.indexOf(member);
				// $scope.members.splice(memberIndex, 1);
				$scope.board.removeMember(member.id)
					.then(function() {
						console.log(member);
						var memberIndex = $scope.members.indexOf(member);
						$scope.members.splice(memberIndex, 1);
						$scope.hideMemberDetails();
					});
			}

			$scope.addMember = function(memberName) {
				var member = _.find($scope.users, function(user) {
					return user.email === memberName;
				});

				// $scope.members.push(member);
				$scope.board.addMember(member.id)
					.then(function() {
						console.log(member);
						$scope.board.members.push(member);
						$scope.members.push(member);
					});
			}

			$scope.getUsers = function(val) {
				return $http.get(Config.api.url() + 'users', {
					params: {
						email: val
					}
				})
				.then(function(res) {

					var users = [];
					// var emails = [];

					angular.forEach(res.data, function(user) {
						users.push(user);
						// emails.push(user.email);
					});

					// return emails;
					return users;
				});
			}

			// Apply action
			$scope.apply = function(result) {
				$modalInstance.close(result);
			}

			// Cancel action
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			}
		}

		var modalOptions = {
			template: require('../../partials/modal-boardedit.html'),
			windowClass: 'modal-size-md',
			controller: controller
		};

		// var members = [{
		// 	email: 'qwe@qwe.qwe'
		// }, {
		// 	email: 'zxc@zxc.zxc'
		// }];

		// var users = getUsers();

		// var userOptions = {
		// 	heading: board.name,
		// 	isPublic: board.isPublic,
		// 	members: [board.owner].concat(board.members),
		// 	// members: [board.owner].concat(members),
		// 	users: getUsers(),
		// 	addUser: addUser,
		// 	removeUser: removeUser
		// };

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
