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
			host: 'http://' + (process.env.HOSTNAME || 'localhost'),
			port: 9001,
		},

		// restful api host and port
		api: {
			host:   'http://' + (process.env.HOSTNAME || 'localhost'),
			port:    9002,
			version: 1
		},

		// static content provider host and port
		// serves things like board images
		static: {
			host: 'http://' + (process.env.HOSTNAME || 'localhost'),
			port: 9002
		}
	},
	production: {
		io: {
			host: process.env.IO_HOST,
			port: process.env.IO_PORT
		},
		api: {
			host:    process.env.API_HOST,
			port:    process.env.API_PORT,
			version: 1
		},
		static: {
			host: process.env.STATIC_HOST,
			port: process.env.STATIC_PORT
		}
	}
}

config = _.extend(config.common,
	config[process.env.NODE_ENV] || config.development);

config.io.url = function() {
	return this.host + ':' + this.port;
}

config.api.url = function() {
	return this.host + ':' + this.port +
		'/api/v' + this.version + '/';
}

config.static.url = function() {
	return this.host + ':' + this.port;
}

module.exports = angular.module('tb.configuration', [ ])
	.value('Config', config);
