// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */
/* eslint import/no-dynamic-require: 0 */

const webpack = require('webpack');
const { basename, dirname, join, relative, resolve } = require('path');
const { sync } = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

const extname = require('path-complete-extname');
const { env, settings, output, loadersDir } = require('./configuration.js');

const extensionGlob = `**/*{${settings.extensions.join(',')}}*`;
const entryPath = join(settings.source_path, settings.source_entry_path);
const packPaths = sync(join(entryPath, extensionGlob));

const entry = packPaths.reduce(
  (map, entryParam) => {
    const localMap = map;
    const namespace = relative(join(entryPath), dirname(entryParam));
    localMap[join(
      namespace,
      basename(entryParam, extname(entryParam))
    )] = resolve(entryParam);
    return localMap;
  },
  {}
);

module.exports = {
  entry,
  output: {
    path: output.path,
    publicPath: output.publicPath,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js'
  },
  module: {
    rules: sync(join(loadersDir, '*.js')).map(loader => require(loader))
  },
  plugins: [
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(env))),
    new MiniCssExtractPlugin({
      filename: env.NODE_ENV === 'production'
        ? '[name]-[hash].css'
        : '[name].css',
      chunkFilename: env.NODE_ENV === 'production'
        ? '[id]-[hash].css'
        : '[id].css'
    }),
    new WebpackAssetsManifest({
      entrypoints: true,
      writeToDisk: true,
      publicPath: true
    })
  ],
  resolve: {
    extensions: settings.extensions,
    modules: [
      resolve(settings.source_path),
      resolve(settings.source_path, 'app'),
      'node_modules'
    ],
    plugins: [ new DirectoryNamedWebpackPlugin(true) ],
    alias: { app: 'app', components: 'app/components', routes: 'app/routes' }
  },
  resolveLoader: { modules: [ 'node_modules' ] },
  node: { fs: 'empty', net: 'empty' },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\\/]node_modules[\\\/]/,
          // create a splitChunk for each node vendor
          name(module) {
            const packageName = module.context.match(
              /[\\\/]node_modules[\\\/](.*?)([\\\/]|$)/
            )[1];

            return `npm.${packageName.replace('@', '')}`;
          }
        }
      }
    }
  }
};
