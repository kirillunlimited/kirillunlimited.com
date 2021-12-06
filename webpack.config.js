const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const isDev = process.env.NODE_ENV !== 'production';

const baseFilename = isDev ? '[name]' : '[name].[contenthash]';

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    app: './src/js/index.js',
    styles: './src/css/index.css',
    light: './src/css/themes/light.css',
    dark: './src/css/themes/dark.css',
  },
  output: {
    filename: `${baseFilename}.js`,
    path: path.resolve(__dirname, 'dist/assets'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: `${baseFilename}.css` }),
    new WebpackManifestPlugin({ publicPath: '/assets/' }),
  ],
};
