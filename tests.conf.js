var karmaWebpackPlugin = require('karma-webpack');
var karmaJasminePlugin = require('karma-jasmine');
var karmaPhantomJSLauncher = require('karma-phantomjs-launcher');
var karmaMochaReporter = require('karma-mocha-reporter');

module.exports = function testsConfig(config) {
  config.set({
    basePath: __dirname,

    frameworks: ['jasmine'],

    files: [
      'spec/spec_index.js'
    ],

    preprocessors: {
      'spec/spec_index.js': ['webpack']
    },

    reporters: [
      'mocha'
    ],

    mochaReporter: {
      ignoreSkipped: true
    },

    port: 9876,

    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
          }
        ]
      }
    },

    webpackMiddleware: {
      stats: {
        colors: true
      }
    },

    colors: true,

    // logLevel: config.LOG_INFO

    autoWatch: true,

    browsers: [
      'PhantomJS'
    ],

    singleRun: false,

    plugins: [
      karmaWebpackPlugin,
      karmaJasminePlugin,
      karmaPhantomJSLauncher,
      karmaMochaReporter
    ]
  });
};
