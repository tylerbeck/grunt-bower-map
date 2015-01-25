/***********************************************************************
 * This class copies bower dependencies to the specified destination
 * Author: Copyright 2012-2014, Tyler Beck
 * License: MIT
 ***********************************************************************/
//TODO: add bower package filter to limit which bower packages are consumed
/**
 * Bower Map Class
 * @param grunt
 * @param bowerPath
 * @param destPath
 * @param shim
 * @param map
 * @param replace
 * @param ignore
 * @param maintainCommonPaths
 * @param useNamespace
 * @param extensions
 * @param done
 * @returns { BowerMap }
 * @constructor
 */
module.exports = function BowerMap( grunt, bowerPath, destPath, shim, map, replace, ignore,
                                    maintainCommonPaths, useNamespace, extensions, done ) {

	'use strict';

	/*================================================
	 * Dependencies
	 *===============================================*/
	var bower = require( 'bower' );
	var path = require( 'path' );
	var glob = require( 'glob' );

	/*================================================
	 * Public Attributes
	 *===============================================*/


	/*================================================
	 * Private Attributes
	 *===============================================*/
	var expandedMap = {};

	var pathSepRegExp = /[\\\/]/gi;

	path.fix = function( val ){
		return path.normalize( val.replace( pathSepRegExp, path.sep ) );
	};

	/*================================================
	 * Public Methods
	 *===============================================*/
	this.execute = function() {

		grunt.verbose.writeln( 'BowerMap::execute' );

		//first make sure everything needed is set
		if ( validateParameters() ) {

			//expand map
			expandedMap = expandMap( map );

			//get component paths
			bower.commands.list( {paths: true} )
					.on( 'end', handleListResults );
		}

	};


	/*================================================
	 * Private Methods
	 *===============================================*/
	/**
	 * copies file and re
	 * @param src
	 * @param dest
	 * @param replacements
	 */
	function copyReplace( src, dest, replacements ){

		var source = grunt.file.read( src );
		for ( var s in replacements ){
			var r = replacements[s];
			var re = new RegExp( s, "g" );
			source = source.replace( re, r );
		}
		grunt.file.write( dest, source );

	}


	/**
	 * validates bower copy task parameters
	 * @returns {boolean}
	 */
	function validateParameters() {
		grunt.verbose.writeln( 'BowerMap::validateParameters' );
		//flag used to determine if validation passes
		var check = true;

		//lib path must be set
		//TODO: get default bowerpath from .bowerrc
		bowerPath = bowerPath || "bower_components";
		if ( typeof bowerPath !== 'string' ) {
			grunt.log.error( 'Bower path must be a string.' );
			check = false;
		}

		//lib path must be set
		if ( !destPath || typeof destPath !== 'string' ) {
			grunt.log.error( 'Default destination path must be configured.' );
			check = false;
		}

		//shim isn't required, but must be a key value object
		shim = shim || {};
		if ( typeof shim !== "object" ) {
			grunt.log.error( 'shim must be an object.' );
			check = false;
		}

		//map isn't required, but must be a key value object
		map = map || {};
		if ( typeof map !== "object" ) {
			grunt.log.error( 'map must be an object.' );
			check = false;
		}

		//ignore isn't required, but must be an array
		ignore = ignore || [];
		if ( !Array.isArray( ignore )  ) {
			grunt.log.error( 'ignore must be an array of strings.' );
			check = false;
		}

		//maintainCommonPaths isn't required, but must be boolean
		maintainCommonPaths = maintainCommonPaths || false;
		if ( typeof maintainCommonPaths !== "boolean" ) {
			grunt.log.error( 'maintainCommonPaths must be a boolean value.' );
			check = false;
		}

		//useNamespace isn't required, but must be undefined or boolean
		if ( useNamespace !== undefined && typeof useNamespace !== "boolean" ) {
			grunt.log.error( 'useNamespace must be boolean or undefined.' );
			check = false;
		}

		//extensions isn't required, but must be an array
		extensions = extensions || undefined;
		if ( extensions !== undefined && !Array.isArray( extensions )  ) {
			grunt.log.error( 'extensions must be an array or undefined.' );
			check = false;
		}

		return check;
	}


	/**
	 * pre-flattens and normalizes map values for easier utilization
	 * @param map
	 * @returns {{}}
	 */
	//TODO: add full globbing for from and to mappings
	function expandMap( map ) {
		grunt.verbose.writeln( 'BowerMap::expandMap' );
		var expanded = {};

		var mappedNames = Object.keys( map );
		mappedNames.forEach( function( packageName ){
			var value = map[ packageName ];

			//get full source path for package
			var src = path.fix( path.join( bowerPath, packageName ) );
			var exists = grunt.file.exists( src );

			//continue if the source exists
			if ( exists ) {
				if ( grunt.file.isFile( src ) ) {
					//src is a file, it must be mapped to a string value
					if ( typeof value === "string" ) {
						expanded[ src ] = path.fix( path.join( destPath, value ) );
					}
					else {
						grunt.log.error( 'Invalid mapped value for: ' + src );
					}
				}
				else {
					//src is a component directory,
					//   value can be an object containing specific file mappings
					//      or
					//   value can be a string path

					var fsrc, fpath;
					if ( typeof value === "object" ) {
						//map specific files
						var fileNames = Object.keys( value );
						fileNames.forEach( function( fileName ){
							//get file source
							fsrc = path.fix( path.join( src, fileName ) );
							//get file destination path
							fpath = path.fix( path.join( destPath, value[ fileName ] ) );
							if ( grunt.file.isFile( fsrc ) ) {
								//source exists, continue with mapping
								expanded[ fsrc ] = fpath;
							}
							else if ( grunt.file.isDir( fsrc ) ) {
								grunt.verbose.writeln( '   map directory: ' + path.join( fsrc, '**' ) );
								glob.sync( path.join( fsrc, '**' ), { dot: true } ).forEach( function( filename ) {
									filename = path.fix( filename );
									if ( grunt.file.isFile( filename ) ) {
										fpath = path.fix( path.join( destPath, value[ fileName ], filename.replace( fsrc, "" ) ) );
										grunt.verbose.writeln( '     from:' + filename );
										grunt.verbose.writeln( '       to:' + fpath );
										expanded[ filename ] = fpath;
									}
								} );

							}
							else {
								grunt.log.error( 'Could not locate source path: ' + fsrc );
							}
						});
					}
					else if ( typeof value === "string" ) {
						//map entire directory
						grunt.verbose.writeln( '   map directory: ' + path.join( src, '**' ) );
						glob.sync( path.join( src, '**' ), { dot: true } ).forEach( function( filename ) {
							if ( grunt.file.isFile( filename ) ) {
								filename = path.fix( filename );
								fpath = path.fix( path.join( destPath, value, filename.replace( src, "" ) ) );
								grunt.verbose.writeln( '     from:' + filename );
								grunt.verbose.writeln( '       to:' + fpath );

								expanded[ filename ] = fpath;
							}
						} );
					}
					else {
						grunt.log.error( 'Invalid mapped value for: ' + src );
					}
				}
			}
			else {
				grunt.log.error( 'Could not locate source path: ' + src );
			}

		});

		return expanded;
	}


	/**
	 * bower list results handler
	 * @param results
	 */
	function handleListResults( results ) {
		grunt.verbose.writeln( 'BowerMap::handleListResults' );

		for ( var k in results ) {
			if ( results.hasOwnProperty( k ) ) {
				grunt.verbose.writeln( '------------------------------------' );
				grunt.verbose.writeln( '    ' + k + ' - ' + results[k] );
				if ( ignore.indexOf( k ) >= 0 ){
					grunt.verbose.writeln( '    ' + k + ' - IGNORED' );
				}
				else{
					copyComponentFiles( k, results[k] );
				}
			}
		}
		done();
	}


	/**
	 * copies specified component files based on mapping
	 * @param name
	 * @param files
	 * @returns {boolean}
	 */
	function copyComponentFiles( name, files ) {
		grunt.verbose.writeln( 'BowerMap::copyComponentFiles - ' + name );
		//get map of files to copy
		var componentMap = getComponentMapping( name, files );

		//copy files
		for ( var k in componentMap ) {
			if ( componentMap.hasOwnProperty( k ) ) {
				console.log( path.fix( k ) );
				console.log( path.fix( componentMap[ k ] ) );
				//grunt.file.copy( path.fix( k ), path.fix( componentMap[ k ] ) );
				var replacements = replace ? replace[ name ] || {} : {};

				copyReplace( path.fix( k ), path.fix( componentMap[ k ] ), replacements );
			}
		}

	}

	/**
	 * gets file mapping for specified component
	 * @param name
	 * @param files
	 * @returns {{}}
	 */
	function getComponentMapping( name, files ) {
		grunt.verbose.writeln( 'BowerMap::getComponentMapping - ' + name );


		//first get list of all files
		var fileList = [];
		if ( shim[ name ] !== undefined ) {
			grunt.verbose.writeln( '    using shim value' );
			//use shim value
			fileList = fileList.concat( shim[ name ] );
		}
		else {
			grunt.verbose.writeln( '    using result value - ' + files );
			//make sure files is an array
			if (typeof files === 'string'){
				files = [files];
			}
			//we just need the path relative to the module directory
			files.forEach( function( file ){
				file = path.fix( file );
				fileList.push( file.replace( path.fix( path.join( bowerPath, name ) ) , "" ) );
			});
		}

		//filter filetypes
		fileList = fileList.filter( function( file ){
			var ext = path.extname( file ).substr(1);
			if ( extensions ){
				return extensions.indexOf( ext ) >= 0;
			}
			else{
				return true
			}
		});


		//get common path for building destination
		var commonPath = maintainCommonPaths ? "" : getCommonPathBase( fileList );
		grunt.verbose.writeln( '   common path: ' + commonPath );
		//build default mapping
		var componentMap = {};
		grunt.verbose.writeln( '   mapping files:' );
		fileList.forEach( function( file ){
			//need to iterate over glob style matches
			grunt.verbose.writeln( '      globbing - ' + path.join( name, file ) );
			glob.sync( path.join( name, file ), { cwd: bowerPath, dot: true } ).forEach( function( filename ) {
				var src = path.fix( path.join( bowerPath, filename ) );
				grunt.verbose.writeln( 'src      ' + src );
				if ( grunt.file.isFile( src ) ) {
					if ( expandedMap[ src ] !== undefined ) {
						//use user configured mapping if set
						componentMap[ src ] = expandedMap[ src ];
					}
					else {
						var newFilename = commonPath === "" ? filename : filename.replace( commonPath, "" );
						var dest = path.fix( path.join( destPath, newFilename ) );
						if ( useNamespace === false || ( useNamespace === undefined && fileList.length === 1 ) ){
							dest = dest.replace( path.join(destPath,name), destPath );
						}
						componentMap[ src ] = dest;
					}
				}
			} );
		});

		return componentMap;

	}


	/**
	 * determines a shared base path among paths
	 * @param paths {Array} of strings
	 * @returns {String}
	 */
	function getCommonPathBase( paths ) {

		var list = [];
		var minLength = 999999999;

		var commonPath = "";

		//break up paths into parts
		paths.forEach( function( file ) {

			//normalize path seperators
			file = file.replace( pathSepRegExp, path.sep );

			//get resolved path parts for file directory
			if ( file.charAt(0) === path.sep ){
				file = file.substr(1);
			}
			//console.log("   "+file);
			//console.log("   "+path.dirname( file ));
			var dirname = path.dirname( file );
			var parts = dirname === "." ? [] : dirname.split( path.sep );
			list.push( parts );

			//save minimum path length for next step
			minLength = Math.min( minLength, parts.length );

		} );

		var listLength = list.length;

		grunt.verbose.writeln( JSON.stringify( list, undefined, "   ") );
		//check for common parts
		if ( listLength > 1 ) {
			var common = true;
			var index = -1;

			//iterate parts up to minLength
			for ( var i = 0; i < minLength; i++ ) {

				for ( var j = 1; j < listLength; j++ ) {
					if ( list[ j ][ i ] !== list[ j - 1 ][ i ] ) {
						common = false;
						break;
					}
				}

				if ( !common ) {
					index = i;
					break;
				}
			}
			//catch case where all paths are common
			if ( index < 0 ){
				index = minLength;
			}

			//build new paths array
			//for ( var n=0; n<listLength; n++ ) {
			//	newPaths.push( path.join( list[n].slice( index ) ) );
			//}

			commonPath = list[0].slice( 0, index ).join( path.sep );

		}
		else if ( listLength === 1 ) {
			commonPath = list[0].join( path.sep );
		}

		return commonPath;

	}


	return this;

};
