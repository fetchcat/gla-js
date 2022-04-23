const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (_, {mode}) => ({
  mode: process.env.NODE_ENV || 'development',
  entry: ['./src/app.js'],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Grocery List',
      header: 'Grocery List',
      metaDesc: 'VanillaJS Grocery Application',
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      scriptLoading: 'defer',
      favicon: './src/icon/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      linkType: 'text/css',
      filename: 'style.css',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
});
