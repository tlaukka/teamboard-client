'use strict';


module.exports = function($window, $timeout, modalService, scrollArea) {

	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');
	var IScroll = require('IScroll');

	return {
		replace: true,
		restrict: 'AE',

		scope: {
			board: '='
			// zoom: '=zoomOptions'
		},

		link: function(scope, element) {

			// Fix scroll area height on iPad
			if (navigator.userAgent.match(/iPad/i)) {
				var scroller = angular.element(document.getElementById('content-scrollarea'));
				// Height: 768 - safariAddressbarHeight(96) - topbarHeight(64) = 608
				scroller.css('height', '608px');
			}

			scrollArea.destroy();
			scrollArea.set(new IScroll('#content-scrollarea', {
				scrollX: true,
				scrollY: true,
				freeScroll: true,
				mouseWheel: true,
				scrollbars: true,
				interactiveScrollbars: true,
				disableMouse: false,

				indicators: {
					el: '.minimap',
					interactive: true,
					resize: false,
					shrink: false
				}
			}));

			$timeout(function() {
				// Set current background image
				scope.setBackground(scope.board.background);
			}, 0);

			scrollArea.refresh(0);

			// var maxWidth = $window.innerWidth;
			// var maxHeight = $window.innerHeight;
			// var size = scope.getMaxAspectRatio(1920, 1080, maxWidth, maxHeight);
			// var left = Math.floor((maxWidth - size.width) / 2);
			// scope.getMaxAspectRatio = function(srcWidth, srcHeight, maxWidth, maxHeight) {
			// 	var ratio = [maxWidth / srcWidth, maxHeight / srcHeight];
			// 	ratio = Math.min(ratio[0], ratio[1]);

			// 	return { width: Math.floor(srcWidth * ratio), height: Math.floor(srcHeight * ratio) };
			// }

			// scope.getBoardPresentationInfo = function() {
			// 	var maxWidth = $window.innerWidth;
			// 	var maxHeight = $window.innerHeight;
			// 	var size = scope.getMaxAspectRatio(1920, 1080, maxWidth, maxHeight);

			// 	return {
			// 		left: Math.floor((maxWidth - size.width) / 2),
			// 		width: size.width
			// 	};
			// }

			// var presentationInfo = scope.getBoardPresentationInfo();
			// console.log(presentationInfo);
			// var boardPresentation = angular.element(document.getElementById('board-presentation'));
			// $timeout(function() {
			// 	boardPresentation.css({
			// 		'left': presentationInfo.left + 'px',
			// 		'width': presentationInfo.width + 'px'
			// 	});

			// 	element.css({
			// 	'width': 900,
			// 	'height': 300,
			// 	'background-size': '100%'
			// });
			// }, 0);

			scope.promptBackgroundAdd = function() {
				var modalOptions = {
					template: require('../../partials/modal-backgroundadd.html'),
					windowClass: 'modal-size-lg'
				}

				var backgrounds = [];
				backgrounds.push({ name: 'Blank', url: 'none' });
				backgrounds.push({ name: 'Kanban', url: 'images/backgrounds/kanban.png' });
				backgrounds.push({ name: 'Scrum', url: 'images/backgrounds/scrum.png' });
				backgrounds.push({ name: 'Business model', url: 'images/backgrounds/business_model_canvas.png' });
				backgrounds.push({ name: 'SWOT', url: 'images/backgrounds/swot.png' });
				backgrounds.push({ name: 'Customer journey', url: 'images/backgrounds/customer_journey_map.png' });
				backgrounds.push({ name: 'Keep drop try', url: 'images/backgrounds/keep_drop_try.png' });
				backgrounds.push({ name: 'Play', url: 'images/backgrounds/play.png' });

				var userOptions = {
					backgrounds: backgrounds,
					currentBg: scope.board.background
				};

				modalService.show(modalOptions, userOptions).then(function(result) {
					scope.updateBackground(result.selectedBg);
				});
			}

			scope.updateBackground = function(bg) {
				scope.board.background = bg;
				scope.board.update()
					.then(function() {
						scope.setBackground(bg);
					});
			}

			scope.setBackground = function(bg) {
				element.css('background-image', 'url(../' + bg + ')');
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
