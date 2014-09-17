'use strict';


module.exports = function($scope, $state, authService, resolvedBoard, tickets) {

	$scope.board = resolvedBoard;
	$scope.tickets = tickets;
	console.log($scope.tickets);

	authService.getUser().then(function(user) {
		$scope.currentUser = user;
	});
}
