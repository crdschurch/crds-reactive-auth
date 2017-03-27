
module.exports = {
  context: __dirname,

  entry: './src/index.ts',

  output: {
    path: __dirname,
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.js', '.ts']
  },

  module: {
    rules: [{
      test: /\.ts$/,
      use: 'awesome-typescript-loader'
    }, {
      test: /\.js$/,
      use: 'babel-loader'
    }]
  }
};
