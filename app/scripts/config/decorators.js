'use strict';


module.exports = function($provide) {

	/*
	 * Fix form autofill using a decorator
	 */
	var FormDirectiveAutofillDecorator =
		require('../decorators/formDirectiveAutofillDecorator');

	$provide.decorator('formDirective', ['$delegate', '$timeout',
		FormDirectiveAutofillDecorator]);

	/*
	 * Fix ngTouch issues with modal forms by using our own ngClick
	 * directive in directives/click.js
	 *
	 * https://github.com/angular/angular.js/issues/6432
	 * TODO: Fix this by not using either Angular UI or angular-touch
	 */
	$provide.decorator('ngClickDirective', ['$delegate',
		function($delegate) {
			$delegate.shift();

			return $delegate;
	}]);

	// Set default tools in text editors
	$provide.decorator('taOptions', ['$delegate', function(taOptions){
		taOptions.toolbar = [
			['h5', 'p'],
			['bold', 'italics', 'underline'],
			['ul', 'ol']
		];

		taOptions.classes = {
			focussed: 'focussed',
			toolbar: 'btn-toolbar',
			toolbarGroup: 'btn-group',
			toolbarButton: 'btn btn-default',
			toolbarButtonActive: 'active',
			disabled: 'disabled',
			textEditor: 'form-control',
			htmlEditor: 'form-control'
		};

		return taOptions;
	}]);

	$provide.decorator('taTools', ['$delegate', function(taTools) {
		taTools.h5.buttontext = 'Header';
		taTools.p.buttontext = 'Paragraph';

		return taTools;
	}]);
}
