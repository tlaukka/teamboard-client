'use strict';


var _       = require('underscore');
var angular = require('angular');

var config = {
	common: {

		// TODO Do we need to have configurable states?
		// states for the ui-router
		states: {
			main:     'main.workspace',
			board:    'main.board',
			login:    'login',
			register: 'register'
		},

		// keys used by localStorage to hold information
		// about the users identity
		userKey:  'tbuser',
		tokenKey: 'tbtoken'
	},
	development: {

		// socket.io server host and port
		io: {
			_url: 'http://' + (process.env.HOSTNAME || 'localhost'),
			_port: 9001,
		},

		// restful api url and port
		api: {
			_url:     'http://' + (process.env.HOSTNAME || 'localhost'),
			_port:    9002,
			_version: 'api/v1'
		},

		// static content provider url and port
		// serves things like board images
		static: {
			_url: 'http://' + (process.env.HOSTNAME || 'localhost'),
			_port: 9002
		}
	},
	production: {
		io: {
			_url:  process.env.IO_URL,
			_port: process.env.IO_PORT
		},
		api: {
			_url:     process.env.API_URL,
			_port:    process.env.API_PORT,
			_version: 'api/v1'
		},
		static: {
			_url:  process.env.STATIC_URL,
			_port: process.env.STATIC_PORT
		}
	}
}

config = _.extend(config.common,
	config[process.env.NODE_ENV] || config.development);

config.io.url = function() {
	return this._url + ':' + this._port;
}

config.api.url = function() {
	return this._url + ':' + this._port + '/' + this._version + '/';
}

config.static.url = function() {
	return this._url + ':' + this._port;
}

module.exports = angular.module('tb.configuration', [ ])
	.value('Config', config);
