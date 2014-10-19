/*
 * grunt-bower-map
 * https://github.com/tylerbeck/grunt-bower-map
 *
 * Copyright (c) 2014 Tyler Beck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		'bower-install-simple': {
			options: {
				color: true,
				directory: "tmp/bower_components"
			},
			default: {

			}
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'classes/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},

		// Configuration to be run (and then tested).
		'bower-map': {
			options:{
				bowerPath: "tmp/bower_components",
				useNamespace: false,
				ignore: ["bootstrap"],
				shim:{
					q: "q.js"
				}
			},
			css: {
				options:{
					dest: "tmp/lib/css",
					extensions:['css']
				}
			},
			js: {
				options:{
					dest: "tmp/lib/js",
					extensions:['js']
				}
			},
			less: {
				options:{
					dest: "tmp/lib/less",
					extensions:['less']
				}
			},
			fonts: {
				options:{
					dest: "tmp/lib/fonts",
					extensions:['ttf','woff','eot','svg']
				}
			}

		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-bower-install-simple');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'bower-install-simple', 'bower-map', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
