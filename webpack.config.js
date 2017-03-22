
module.exports = {
  context: __dirname,

  entry: './src/index.js',

  output: {
    path: __dirname,
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
