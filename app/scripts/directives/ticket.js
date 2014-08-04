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
			index: '@',
			snap: '=snapOptions',
			ticket: '=ticketData',
			promptTicketRemove: '&ticketRemove',
			editTicket: '&ticketEdit',
			toggleTicketSelection: '&ticketToggle'
		},

		link: function(scope, element) {
			var ticket = scope.ticket;
			var snap = scope.snap;

			scope.isSelected = false;

			// TODO: Need to handle zIndex
			TweenLite.to(element, 0, {
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

			scope.collapse = function() {
				if (element.hasClass('drag-end')) {
					element.removeClass('drag-end');
					return;
				}

				scope.isCollapsed = !scope.isCollapsed;
			}

			scope.removeTicket = function(event) {
				// stop from opening modal to edit ticket
				event.stopPropagation();

				scope.$emit('ticket:remove', { id: ticket.id });
				//ticket.remove();
			}

			scope.selectTicket = function() {
				if (element.hasClass('selected')) {
					element.removeClass('selected');
				}
				else {
					element.addClass('selected');
				}

				scope.toggleTicketSelection({ index: scope.index });
			}
		}
	}
}
