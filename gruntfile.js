var env = require('./sources/tasks/env');

('use strict');

module.exports = function (grunt) {
	require('time-grunt')(grunt);
	require('jit-grunt')(grunt);

	var includeAll;

	try {
		includeAll = require('include-all');
		grunt.initConfig({
			config: env(),
		});
	} catch (e0) {
		try {
			includeAll = require('sails/node_modules/include-all');
		} catch (e1) {
			console.error('To fix this, please run: yarn add include-all --save`');

			grunt.registerTask('default', []);
			return;
		}
	}

	function loadTasks(relPath) {
		return (
			includeAll({
				dirname: require('path').resolve(__dirname, relPath),
				filter: /(.+)\.js$/,
				excludeDirs: /^\.(git|svn)$/,
			}) || {}
		);
	}

	function invokeConfigFn(tasks) {
		for (var taskName in tasks) {
			if (tasks.hasOwnProperty(taskName)) {
				tasks[taskName](grunt);
			}
		}
	}

	var taskConfigurations = loadTasks('./sources/tasks/config');
	var registerDefinitions = loadTasks('./sources/tasks/register');

	if (!registerDefinitions.default) {
		registerDefinitions.default = function (grunt) {
			grunt.registerTask('default', []);
		};
	}

	invokeConfigFn(taskConfigurations);
	invokeConfigFn(registerDefinitions);
};
