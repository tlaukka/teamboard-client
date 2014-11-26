'use strict';


module.exports = function(ticketProxy, scrollArea) {

	var TweenLite = require('TweenLite');
	var CSSPlugin = require('CSSPlugin');
	var Draggable = require('Draggable');

	return {
		template: require('../../partials/ticket.html'),
		restrict: 'E',
		replace: true,

		scope: {
			snap: '=snapOptions',
			search: '=ticketSearch',
			ticket: '=ticketData',
			promptTicketEdit: '&ticketEdit',
			toggleTicketSelection: '&ticketToggle'
		},

		link: function(scope, element) {
			var ticket = scope.ticket;
			var snap = scope.snap;

			scope.isSelected = false;

			// TODO: Need to handle zIndex
			TweenLite.set(element, {
				x: ticket.position.x,
				y: ticket.position.y
			});

			Draggable.create(element, {
				type: 'x,y',
				bounds: '#board',
				edgeResistance: 0.65,

				onDragStart: function() {
					scrollArea.disable();
					element.addClass('dragging');

					if (snap.enabled) {
						ticketProxy.isVisible = true;
					}
				},

				onDrag: function() {
					if (snap.enabled) {
						var x = Math.round(this.x / snap.gridWidth) * snap.gridWidth;
						var y = Math.round(this.y / snap.gridHeight) * snap.gridHeight;

						scope.$apply(function() {
							ticketProxy.position.x = x;
							ticketProxy.position.y = y;
						});
					}
				},

				onDragEnd: function() {
					ticketProxy.isVisible = false;
					scrollArea.enable();
					element.removeClass('dragging');
					element.addClass('drag-end');
					var x = 0;
					var y = 0;

					// Snap to grid if enabled
					if (snap.enabled) {
						x = Math.round(this.x / snap.gridWidth) * snap.gridWidth;
						y = Math.round(this.y / snap.gridHeight) * snap.gridHeight;
					}
					else {
						x = Math.abs(this.x.toFixed(2));
						y = Math.abs(this.y.toFixed(2));
					}

					var z = parseInt(this.target.style.zIndex);

					ticket.position = { x: x, y: y, z: z }

					return ticket.save();
				}
			});

			Draggable.zIndex = 100;

			scope.$watch('ticket.position', function() {
				TweenLite.to(element, 1,
					{ x: ticket.position.x, y: ticket.position.y });
			});

			scope.$watch('search.str', function(str) {
				if (str.length != 0 && ticket.heading.indexOf(str) > -1) {
					element.removeClass('unfocused');
				}
				else if (str.length != 0) {
					element.addClass('unfocused');
				}
				else {
					if (element.hasClass('unfocused')) {
						element.removeClass('unfocused');
					}
				}
			});

			scope.$on('action:select-tickets', function(event, select) {
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

			scope.onSelectClicked = function($event) {
				$event.stopPropagation();
				scope.toggleSelection();
			}

			scope.toggleSelection = function() {
				scope.toggleTicketSelection({ id: scope.ticket.id });
			}

			scope.editTicket = function($event) {
				$event.stopPropagation();

				// Prevent click event afger drag
				if (element.hasClass('drag-end')) {
					element.removeClass('drag-end');
					return;
				}

				scope.promptTicketEdit({ ticket: scope.ticket });
			}
		}
	}
}
