'use strict';

/*
 * Copied from https://gist.github.com/stefanotorresi/1de83e989fd780873af6
 */

/**
 * workaround for:  https://github.com/angular/angular.js/issues/1460
 * source:          http://victorblog.com/2014/01/12/fixing-autocomplete-autofill-on-angularjs-form-submit/
 * decoration tips: http://angular-tips.com/blog/2013/09/experiment-decorating-directives/
 * credits:         https://github.com/evictor
 * 
 * note:            this directive only fixes the behaviour on form submit event,
*                   it doesn't fix the bidirectional data binding
 * 
 * wiring:          add to any angular.module.config()
 *                  $provide.decorator('formDirective', ['$delegate', '$timeout', FormDirectiveAutofillDecorator]);
 * 
 **/
//function FormDirectiveAutofillDecorator($delegate, $timeout) {
module.exports = function($delegate, $timeout) {
	var formDirective = $delegate[0];
    var oldCompile = formDirective.compile;

    formDirective.compile = function(tElement, tAttrs, transclude) {
        // get original links
        var compile = oldCompile ? oldCompile.apply(this, arguments) : {};
        var oldPost = compile.post;

        compile.post = function(scope, element, attrs) {

            if (oldPost) {
                oldPost.apply(this, arguments);
            }

            // only applies if angular submit handler is registered
            if(! attrs.ngSubmit) {
                return;
            }

            // on submit, trigger additional events on every input
            // to ensure the model is actually updated
            $timeout(function() {
                element.unbind('submit').bind('submit', function(event) {
                    event.preventDefault();

                    var formElements = [
                        element.find('input'),
                        element.find('textarea'),
                        element.find('select')
                    ];

                    angular.forEach(formElements, function(formElement) {
                        formElement
                            .triggerHandler('input')
                            .triggerHandler('change')
                            .triggerHandler('keydown')
                        ;
                    });

                    scope.$apply(attrs.ngSubmit);
                });
            });
        };

        return compile;
    };

    return $delegate;
}
