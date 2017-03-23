
module.exports = {
  context: __dirname,

  entry: './src/index.js',

  output: {
    path: __dirname,
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.js', '.ts']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  }
};
