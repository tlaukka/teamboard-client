'use strict';


module.exports = function($http, Config, Ticket, scrollArea, authService) {

	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');

	return {
		restrict: 'E',
		template: require('../../partials/boardpreview.html'),
		replace: true,

		scope: {
			board: '=boardData',
			workspaceState: '=workspaceState',
			promptBoardEdit: '&boardEdit',
			toggleBoardSelection: '&boardToggle'
		},

		link: function(scope, element) {

			$http.get(Config.api.url() + 'boards/' + scope.board.id + '/tickets')
				.then(function(response) {
					var tickets = [];
					for(var i = 0; i < response.data.length; i++) {
						var ticketData = response.data[i];
						ticketData.board = scope.board.id;
						tickets.push(new Ticket(ticketData));
					}

					scope.tickets = tickets;
				},
				function(err) {
					// TODO Handle it?
					console.log('err', err);
				});

			scope.isLoading = false;
			scope.isSelected = false;

			scope.screenshotUrl = scope.board.screenshot + '?' +
				'access_token=' + authService.getToken() + '&' +
				// it just works
				'refresh=' + new Date().getTime() + '';


			scope.$on('action:select-boards', function(event, select) {
				if (select) {
					if (!scope.isSelected) {
						scope.isSelected = true;
						scope.toggleSelection();
					}
				}
				else {
					if (scope.isSelected) {
						scope.isSelected = false;
						scope.toggleSelection();
					}
				}
			});

			scope.onBoardClicked = function($event) {
				$event.stopPropagation();

				scope.isLoading = true;
				scope.workspaceState.isLoadingBoard = true;

				var thumbnailContainer = angular.element(element.children()[0]);
				thumbnailContainer.css('z-index', 1000);

				// scrollArea.scrollTo(0, 0);

				// var row = Math.floor(scope.index / 3);
				// var col = scope.index % 3;

				// var marginX = -((col + 1) * 36 + col * 24);
				// var marginY = -((row + 1) * 36 + row * 24);

				// var newX = marginX - col * 200 - 5;
				// var newY = marginY - row * 184;

				// var thumbnailContainer = angular.element(element.children()[0]);
				// thumbnailContainer.css('z-index', 1000);
				// thumbnailContainer.css('border', 'none');
				// thumbnailContainer.css('box-shadow', 'none');

				// TweenLite.to(thumbnailContainer, 0.4, {
				// 	left: newX,
				// 	top: newY,
				// 	scaleX: 5,
				// 	scaleY: 5,
				// 	transformOrigin: 'left top'
				// });
			}

			scope.onSelectClicked = function($event) {
				$event.stopPropagation();
				scope.toggleSelection();
			}

			scope.toggleSelection = function() {
				if (element.hasClass('selected')) {
					element.removeClass('selected');
				}
				else {
					element.addClass('selected');
				}

				scope.toggleBoardSelection({ id: scope.board.id });
			}
		}
	};
}
