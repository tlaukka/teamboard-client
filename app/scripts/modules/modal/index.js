'use strict';

var angular = require('angular');

/**
 * Shamelessly copied from 'btford.modal'.
 */
module.exports = angular.module('tb.modal', [])

	/**
	 *
	 */
	.factory('Modal', function($animate, $compile, $rootScope, $controller) {
		return function ModalFactory(opts) {

			var template   = opts.template;
			var controller = opts.controller;

			var scope   = null;
			var element = null;

			/**
			 * Attaches the modal the DOM.
			 */
			var _attach = function _attach(props) {
				scope   = $rootScope.$new();
				element = angular.element(template);

				$animate.enter(element, document.body);

				// Copy any given properties to the controller's 'scope'.
				if(props) {
					for(var name in props) {
						scope[name] = props[name];
					}
				}

				$controller(controller, { '$scope': scope });
				$compile(element)(scope);
			}

			return {
				/**
				 *
				 */
				open: function(props) {
					if(!element) {
						return _attach(template, props);
					}
				},

				/**
				 *
				 */
				close: function() {
					if(element) {
						$animate.leave(element).then(function() {
							scope.$destroy();

							scope   = null;
							element = null;
						});
					}
				}
			}
		}
	});

