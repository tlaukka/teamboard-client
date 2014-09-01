'use strict';


module.exports = function() {
	return {
		template: require('../../partials/minimap.html'),
		restrict: 'E',
		replace: true,

		scope: {
			tickets: "="
		},

		link: function(scope, element) {

			scope.setTicket = function(ticket) {
				return {
					'background-color': ticket.color,
					'left': (ticket.position.x * 0.1) + 'px',
					'top': (ticket.position.y * 0.1) + 'px'
				}
			}
		}
	};
}
