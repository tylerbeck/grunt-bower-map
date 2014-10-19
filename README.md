# grunt-bower-map

> Copy bower component files.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bower-map --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bower-map');
```

## The "bower_map" task

### Overview
In your project's Gruntfile, add a section named `'bower-map'` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
   'bower-map': {
       default: {
           options: {
                dest: 'assets/lib',
           }
       }
   }
});
```

### Options

#### dest (required)
Type: `String`
Default value: `undefined`

The default base path into which components are copied.


#### bowerPath
Type: `String`
Default value: `'bower_components'`

Path to the Bower install directory.

#### ignore
Type: `Array`
Default value: `[]`

An array of bower component names to ignore.

#### maintainCommonPaths
Type: `Boolean`
Default value: `false`

When set to false (the default value) unmapped files are copied relative to their highest-level common directory,
otherwise files are copied based on path to component root.

#### map
Type: `Object`
Default value: `undefined`

An object used to remap component file destinations.

#### shim
Type: `Object`
Default value: `undefined`

An object used to specify or replace the value of 'main' defined in bower.json or package.json for the specified keys (component names).

#### useNamespace
Type: `Boolean|undefined`
Default value: `undefined`

If true, all files are namespaced in destination using package name.
If false, all files use the destination as a base folder.
If undefined, only packages more than one file (per sub-task) are written to namespaced directories.



### Usage Examples

#### Default Options
In this example all bower components with a `bower.json` file that have a `main` attribute will be copied to `assets/lib/[component_name]/*`

```js
grunt.initConfig({
  'bower-map': {
	dest: 'assets/lib/',
  },
});
```

#### Custom Options
TODO

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0