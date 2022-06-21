const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssnanoPlugin = require('cssnano-webpack-plugin');
const PostCSSPresetEnv = require('postcss-preset-env');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const isDev = process.env.NODE_ENV !== 'production';

const baseFilename = isDev ? '[name]' : '[name].[contenthash]';

module.exports = {
  mode: isDev ? 'development' : 'production',
  stats: {
    colors: true,
    preset: 'minimal',
  },
  performance: {
    hints: isDev ? 'warning' : 'error',
  },
  devtool: isDev ? 'cheap-module-source-map' : 'source-map',
  entry: {
    app: './src/assets/js/index.js',
    styles: './src/assets/css/index.css',
    light: './src/assets/css/themes/light.css',
    dark: './src/assets/css/themes/dark.css',
  },
  output: {
    filename: `${baseFilename}.js`,
    path: path.resolve(__dirname, 'dist/assets'),
  },
  ...(!isDev && {
    optimization: {
      minimizer: [new TerserPlugin(), new CssnanoPlugin()],
    },
  }),
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
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [PostCSSPresetEnv],
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: `${baseFilename}[ext]`,
        },
      },
    ],
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({ filename: `${baseFilename}.css` }),
    new WebpackManifestPlugin({ publicPath: '/assets/' }),
    ...(process.env.DEBUG ? [new BundleAnalyzerPlugin()] : []),
  ],
};
