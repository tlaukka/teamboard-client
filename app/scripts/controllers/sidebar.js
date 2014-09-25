'use strict';


module.exports = function($scope, $rootScope, $state, $timeout, $translate, authService, socketService) {

	// Set the initial state
	$scope.isCollapsed = (localStorage.getItem('tb-sidebar-collapsed') === 'true');
	$timeout(function() {
		$rootScope.$broadcast('action:sidebar-collapse', $scope.isCollapsed);
	}, 0);

	authService.getUser().then(function(user) {
		$scope.currentUser = user;
	});

	$scope.isLanguagesCollapsed = true;

	// Available languages
	$scope.languages = [];
	$scope.languages.push({ key: 'en', image: 'images/flags/gb.png' });
	$scope.languages.push({ key: 'fi', image: 'images/flags/fi.png' });
	$scope.languages.push({ key: 'se', image: 'images/flags/se.png' });
	$scope.languages.push({ key: 'ru', image: 'images/flags/ru.png' });

	$scope.logout = function() {
		authService.logout().then(function() {
			socketService.disconnect();
			$state.go('login');
		});
	}

	$scope.toggleCollapse = function() {
		$scope.isCollapsed = !$scope.isCollapsed;
		localStorage.setItem('tb-sidebar-collapsed', $scope.isCollapsed.toString());
		$rootScope.$broadcast('action:sidebar-collapse', $scope.isCollapsed);
	}

	$scope.setLanguage = function(key) {
		$translate.use(key);
		localStorage.setItem('tb-language', key);
	}
}
