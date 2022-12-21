const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname,'./src/server.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          '/node_modules/',
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        }
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts','.jsx', '.js', ],
  },
  target: 'node'
};
