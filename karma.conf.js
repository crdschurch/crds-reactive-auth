var karmaWebpackPlugin = require('karma-webpack');
var karmaJasminePlugin = require('karma-jasmine');
var karmaTypescriptPlugin = require('karma-typescript');
var karmaPhantomJSLauncher = require('karma-phantomjs-launcher');
var karmaMochaReporter = require('karma-mocha-reporter');

module.exports = function testsConfig(config) {
  config.set({
    basePath: __dirname,

    frameworks: ['jasmine', 'karma-typescript'],

    files: [
      './spec/spec_index.js'
    ],

    preprocessors: {
      './spec/spec_index.js': ['webpack'],
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
            use: 'awesome-typescript-loader'
          }
        ]
      }
    },

    webpackMiddleware: {
      stats: {
        colors: true
      }
    },

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      include: ['**/*.ts'],
      exclude: ['node_modules']
    },

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: [
      'PhantomJS'
    ],

    singleRun: true,

    plugins: [
      karmaWebpackPlugin,
      karmaJasminePlugin,
      karmaTypescriptPlugin,
      karmaPhantomJSLauncher,
      karmaMochaReporter
    ]
  });
};
