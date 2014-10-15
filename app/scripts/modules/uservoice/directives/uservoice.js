'use strict';

module.exports = function() {
	var count = 0;

	return {
		restrict: 'A',

		scope: {
			mode: '@',
			position: '@',
			accentColor: '@',
			widgetHeight: '@',
			widgetWidth: '@',
			smartvoteEnabled: '@',
			identify: '='
		},

		link: function(scope, elem, attrs) {
			elem.attr('id', 'feedback-uservoice-' + count.toString());
			count = count + 1;

			var set = [
				scope.mode,
				scope.position,
				scope.accentColor,
				scope.widgetHeight,
				scope.widgetWidth,
				scope.smartvoteEnabled ];

			var def = ['contact', 'automatic', '#448dd6', '300px', '300px', true];

			for (var i = 0; i < set.length; i++) {
				if (!set[i]) {
					set[i] = def[i];
				}
			}

			if (set[5] === 'true') {
				set[5] = true;
			}
			else if (set[5] === 'false') {
				set[5] = false;
			}
			else {
				set[5] = true;
			}

			if (UserVoice) {
				UserVoice.push(['set', {
					position: set[1],
					accent_color: set[2],
					height: set[3],
					width: set[4],
					smartvote_enabled: set[5]
				}]);

				UserVoice.push(['addTrigger', '#' + elem.attr('id'), {
					mode: set[0]
				}]);

				// UserVoice.push(['autoprompt', { mode: 'smartvote', trigger_position: 'bottom-right' }]);
				UserVoice.push(['autoprompt', {}]);
			}

			var setIdentify = function() {
				if (scope.identify) {
					UserVoice.push(['identify', scope.identify]);
				}
			}

			scope.$watch('identify', setIdentify);
		}
	}
}
