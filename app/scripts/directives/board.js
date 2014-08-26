'use strict';


module.exports = function(modalService) {

	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');

	return {
		replace: true,
		restrict: 'AE',
		scope: {
			prompBackgroundAdd: '&backgroundAdd'
			// zoom: '=zoomOptions'
		},

		link: function(scope, element) {

			// Set current background image
			var currentBg = localStorage.getItem('tb-board-bg');
			element.css('background-image', 'url(../' + currentBg + ')');

			scope.promptBackgroundAdd = function() {
				var modalOptions = {
					template: require('../../partials/modal-backgroundadd.html'),
					windowClass: 'modal-size-lg'
				}

				var backgrounds = [];
				backgrounds.push({ name: 'Blank', url: 'none' });
				backgrounds.push({ name: 'Scrum', url: 'images/workflow_template_scrum.png' });
				backgrounds.push({ name: 'Test Bg 01', url: 'images/bg01.jpg' });
				backgrounds.push({ name: 'Test Bg 02', url: 'images/bg02.jpg' });
				backgrounds.push({ name: 'Test Bg 03', url: 'images/bg03.jpeg' });

				var userOptions = {
					backgrounds: backgrounds,
					currentBg: currentBg
				};

				modalService.show(modalOptions, userOptions).then(function(result) {
					localStorage.setItem('tb-board-bg', result.selectedBg);
					element.css('background-image', 'url(../' + result.selectedBg + ')');
				});
			}

			// triggered from TopBarController
			scope.$on('action:add-background', function(event, data) {
				scope.promptBackgroundAdd();
			});


			// var zoom = scope.zoom;
			// var transformOrigin = 'center top';

			// scope.zoomOut = function() {
			// 	var html = angular.element(document.querySelector('html'))[0];
			// 	var scale = 0.9 * html.clientHeight / element[0].offsetHeight;
			// 	TweenLite.to(element, 0.6, { scale: scale, transformOrigin: transformOrigin });
			// }

			// scope.zoomNormal = function() {
			// 	TweenLite.to(element, 0.6, { scale: 1, transformOrigin: transformOrigin });
			// }

			// scope.$watch('zoom.out', function() {
			// 	if (zoom.out) {
			// 		scope.zoomOut();
			// 	}
			// 	else {
			// 		scope.zoomNormal();
			// 	}
			// });

			// scope.$watchCollection('tickets', function() {

			// });
		}
	};
}
