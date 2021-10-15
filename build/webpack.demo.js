/**
 * @Description: webpack配置文件
 * @Author: Ableson
 * @Date: 2021/10/9 16:31
 * @LastEditors: Ableson
 * @LastEditTime: 2021/10/9 16:31
 */
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./examples/entry.js",
  output: {
    path: path.resolve(process.cwd(), './examples/ableson-ui/'),
    filename: "bundle.js"
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    publicPath: '/',
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      favicon: "./examples/favicon.ico",
      template: "./examples/index.html",
      filename: "index.html",
      inject: true
    })
  ]
};
