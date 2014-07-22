'use strict';


/**
 * A service for displaying modal dialogs.
 *
 * @example
 * // Define modal options
 * var boardName = 'someBoardName';
 * var userOptions = {
 *     closeButtonText: 'Cancel',
 *     actionButtonText: 'Remove',
 *     headerText: 'Remove ' + boardName + '?',
 *     bodyText: 'Are you sure you want to remove this board?'
 * };
 *
 * // Open a modal dialog and process the result
 * Modal.showModal({}, modalOptions).then(function (result) {
 *     // Actions according to result...
 *     },
 *     optonalDismissHandler);
 * });
 *
 * In the template, any form data can be passed to the ok() function
 * and then retrieved from the result.
 *
 * @param  {Object} $modal Modal service
 */
module.exports = function($modal) {

	// Default modal options
	var modalOptions = {
		backdrop: true,
		keyboard: true,
		modalFade: true,
		templateUrl: ''
	}

	// Default user options
	var userOptions = { }

	/**
	 * Shows a modal dialog with given options.
	 *
	 * @param  {Object} customModalOptions Specified modal options, can be null
	 * @param  {Object} customUserOptions  Specified user options
	 * @return {Promise}	Modal result
	 */
	this.show = function (customModalOptions, customUserOptions) {
		if (!customModalOptions) {
			customModalOptions = { }
		}

		var tempModalOptions = { }
		var tempUserOptions  = { }

		// Map angular-ui modal custom options to modal options defined in the service
		angular.extend(tempModalOptions, modalOptions, customModalOptions);

		// Map custom user options to user options defined in the service
		angular.extend(tempUserOptions, userOptions, customUserOptions);

		if (!tempModalOptions.controller) {

			// Controller for the modal dialog
			tempModalOptions.controller = function($scope, $modalInstance) {
				$scope.userOptions = tempUserOptions;

				// Apply action
				$scope.userOptions.apply = function(result) {
					$modalInstance.close(result);
				}

				// Cancel action
				$scope.userOptions.cancel = function() {
					$modalInstance.dismiss('cancel');
				}
			}
		}

		return $modal.open(tempModalOptions).result;
	}
}
