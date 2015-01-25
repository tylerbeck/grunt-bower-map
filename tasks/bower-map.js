/***********************************************************************
 * This task copies bower dependencies to the specified destination
 * Author: Copyright 2012-2014, Tyler Beck
 * License: MIT
 ***********************************************************************/


module.exports = function( grunt ){

	/*================================================
	 * Dependencies
	 *===============================================*/
	var BowerCopy = require('../classes/BowerMap');

	 /*
	 *
	 *  TASK-RESULT:
	 *      ./assets
	 *      |-- js/lib
	 *      |   |--component-1.js
	 *      |   |--component-2.one.js
	 *      |   |--component-2.two.js
	 *      |   |--component-3.one.js
	 *      |   |--component-3.two.js
	 *      |   |--component-4
	 *      |      |-- one.js
	 *      |      |-- two.js
	 *      |
	 *      |-- css
	 *      |   |-- style-component.css
	 *
	 */


	/*================================================
	 * Task
	 *===============================================*/
	grunt.registerMultiTask('bower-map', 'Copy Bower Dependencies.', function(){

		var options = this.options({

		});

		//create instance of class and execute
		( new BowerCopy(
				grunt,
				options.bowerPath,
				options.dest,
				options.shim,
				options.map,
				options.replace,
				options.ignore,
				options.maintainCommonPaths,
				options.useNamespace,
				options.extensions,
				this.async()
		) ).execute();

		grunt.log.writeln();

	} );

};