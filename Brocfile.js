/* global require, module */

var uglifyJavaScript = require('broccoli-uglify-js');
var replace = require('broccoli-replace');
var compileES6 = require('broccoli-es6-concatenator');
var validateES6 = require('broccoli-es6-import-validate');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var autoprefixer = require('broccoli-autoprefixer');

var env = require('broccoli-env').getEnv();
var getEnvJSON = require('./config/environment');

var p = require('ember-cli/lib/preprocessors');
var preprocessCss = p.preprocessCss;
var preprocessTemplates = p.preprocessTemplates;
var preprocessJs = p.preprocessJs;

module.exports = function (broccoli) {

  var prefix = 'ember-share-demo';
  var rootURL = '/';

  // index.html

  var indexHTML = pickFiles('app', {
    srcDir: '/',
    files: ['index.html'],
    destDir: '/'
  });

  indexHTML = replace(indexHTML, {
    files: ['index.html'],
    patterns: [{ match: /\{\{ENV\}\}/g, replacement: getEnvJSON.bind(null, env)}]
  });

  // sourceTrees, appAndDependencies for CSS and JavaScript

  var app = pickFiles('app', {
    srcDir: '/',
    destDir: prefix
  });

  app = preprocessTemplates(app);

  var config = pickFiles('config', { // Don't pick anything, just watch config folder
    srcDir: '/',
    files: [],
    destDir: '/'
  });

  var sourceTrees = [app, config, 'vendor'].concat(broccoli.bowerTrees());
  var appAndDependencies = mergeTrees(sourceTrees, { overwrite: true });

  // JavaScript

  var legacyFilesToAppend = [
    'jquery.js',
    'handlebars.js',
    'ember.js',
    'ic-ajax/dist/named-amd/main.js',
    'ember-resolver.js',
    'ember-shim.js',
    'ember-share.amd.js'
  ];

  var applicationJs = preprocessJs(appAndDependencies, '/', prefix);

  applicationJs = compileES6(applicationJs, {
    loaderFile: 'loader/loader.js',
    ignoredModules: [
      'ember/resolver',
      'ic-ajax',
      'ember-share/store',
      'ember-share/models/share-proxy',
      'ember-share/models/share-array',
      'ember-share/mixins/share-text',
      'ember-share/utils'
    ],
    inputFiles: [
      prefix + '/**/*.js'
    ],
    legacyFilesToAppend: legacyFilesToAppend,
    wrapInEval: env !== 'production',
    outputFile: '/assets/app.js'
  });

  if (env === 'production') {
    applicationJs = uglifyJavaScript(applicationJs, {
      mangle: false,
      compress: false
    });
  }

  // Styles

  var styles = preprocessCss(appAndDependencies, prefix + '/styles', '/assets');
  styles = autoprefixer(styles);
  // Ouput

  var outputTrees = [
    indexHTML,
    applicationJs,
    'public',
    styles
  ];

  return mergeTrees(outputTrees, { overwrite: true });
};
