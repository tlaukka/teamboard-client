'use strict';

var _       = require('lodash');
var angular = require('angular');

/**
 * Shamelessly copied from 'btford.modal'.
 */
module.exports = angular.module('tb.modal', [])

	/**
	 *
	 */
	.factory('Modal', function($q, $animate, $compile, $rootScope, $controller) {

		var _scope   = null;
		var _element = null;
		var _promise = null;

		/**
		 * Creates a new scope and attaches the modal the DOM.
		 */
		var _attach = function attach(template, controller, props) {
			_scope        = $rootScope.$new();
			_scope.close  = _close;
			_scope.result = _.clone(props);

			_element = angular.element(template);
			$animate.enter(_element, document.body);

			$controller(controller, { '$scope': _scope });
			$compile(_element)(_scope);
		}

		/**
		 *
		 */
		var _open = function open(template, controller, props) {
			var deferred = $q.defer();

			if(!_element) {
				_promise = deferred;
				_attach(template, controller, props);
			}
			else {
				deferred.reject(new Error('A modal is already open'));
			}

			return deferred.promise;
		}

		/**
		 *
		 */
		var _close = function close(submit) {
			if(!_element) return;

			$animate.leave(_element).then(function() {
				if(_promise && submit) {
					_promise.resolve(_.clone(_scope.result))
				}

				_scope.$destroy();

				_scope   = null;
				_element = null;
				_promise = null;
			});
		}

		/**
		 *
		 */
		return function ModalFactory(opts) {
			var template   = opts.template;
			var controller = opts.controller || angular.noop;

			return {
				'open':  _open.bind(null, template, controller),
				'close': _close,
			}
		}
	});

