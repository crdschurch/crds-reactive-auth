var karmaWebpackPlugin = require('karma-webpack');
var karmaJasminePlugin = require('karma-jasmine');
var karmaTypescripePlugin = require('karma-typescript');
var karmaPhantomJSLauncher = require('karma-phantomjs-launcher');
var karmaMochaReporter = require('karma-mocha-reporter');

module.exports = function testsConfig(config) {
  config.set({
    basePath: __dirname,

    frameworks: ['jasmine', 'karma-typescript'],

    files: [
      'spec/spec_index.js'
    ],

    preprocessors: {
      'spec/spec_index.js': ['webpack', 'karma-typescript']
    },

    reporters: [
      'mocha'
    ],

    mochaReporter: {
      ignoreSkipped: true
    },

    port: 9876,

    webpack: {
      resolve: {
        extensions: ['.js', '.ts']
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            use: 'babel-loader'
          },
          {
            test: /\.ts$/,
            use: 'ts-loader'
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
      karmaTypescripePlugin,
      karmaPhantomJSLauncher,
      karmaMochaReporter
    ]
  });
};
