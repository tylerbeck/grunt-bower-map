'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

function fileExists( path, msg  ){
	return function( test ){
		var value = grunt.file.exists( path );
		test.equal( value, true, "The file '"+path+"'  should exist."  );
		test.done();
	};
}


exports.bower_map = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	default_test: function(test) {
		test.equal(1, 1, 'should describe what the default behavior is.');
		test.done();
	}
};
