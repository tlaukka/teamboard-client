'use strict';


module.exports = function($scope, $rootScope, $state, $timeout, $translate, $window, authService) {

	// Set the initial state
	if ($window.innerWidth < 768) {
		$scope.isCollapsed = true;
		$timeout(function() {
			$rootScope.$broadcast('action:sidebar-collapse', true);
		}, 0);
	}
	else {
		$scope.isCollapsed = (localStorage.getItem('tb-sidebar-collapsed') === 'true');
		$timeout(function() {
			$rootScope.$broadcast('action:sidebar-collapse', $scope.isCollapsed);
		}, 0);
	}

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
