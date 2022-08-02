const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './client/index.js'),
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html'
    }),
    // "@babel/plugin-transform-modules-commonjs"
  ],
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'build'),
      publicPath: '/'
    },
    proxy: {
      // '/': 'http://localhost:3000',
      // '/signup': 'http://localhost:3000',
      // '/createPost': 'http://localhost:3000',
      compress: true,
      port: 8080,
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.jsx?/,
        // exclude: /(node_modules)/,
        exclude: path.resolve(__dirname, '../node_modules'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
      }
    ]
  }

}