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

			var bg = localStorage.getItem('tb-board-bg');
			element.css('background-image', 'url(../' + bg + ')');

			scope.promptBackgroundAdd = function() {
				var modalOptions = {
					template: require('../../partials/modal-backgroundadd.html'),
					windowClass: 'modal-size-lg'
				}

				var backgrounds = [];
				backgrounds.push({ url: 'images/workflow_template_scrum.png', name: 'Scrum' });
				backgrounds.push({ url: 'images/bg01.jpg', name: 'Test Bg 01' });
				backgrounds.push({ url: 'images/bg02.jpg', name: 'Test Bg 02' });
				backgrounds.push({ url: 'images/bg03.jpeg', name: 'Test Bg 03' });

				var userOptions = {
					backgrounds: backgrounds
				};

				modalService.show(modalOptions, userOptions).then(function(result) {
					localStorage.setItem('tb-board-bg', result.selectedBgUrl);
					element.css('background-image', 'url(../' + result.selectedBgUrl + ')');
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
