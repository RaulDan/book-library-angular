const path = require('node:path');
const webpack = require('webpack');
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = async () => {
  const { default: linkerPlugin } = await import('@angular/compiler-cli/linker/babel');
  return {
    // Angular resource child compilations require an EntryPlugin on the parent.
    entry: { federation: './src/federation/mount.ts' },
    output: {
      path: path.resolve(__dirname, 'dist/federation'),
      publicPath: 'auto',
      uniqueName: 'book_library',
      clean: true,
    },
    resolve: { extensions: ['.ts', '.js'] },
    module: {
      rules: [
        { test: /\.ts$/, loader: '@ngtools/webpack' },
        {
          test: /\.m?js$/,
          include: /node_modules[\\/]@angular[\\/]/,
          use: {
            loader: 'babel-loader',
            options: { plugins: [linkerPlugin], cacheDirectory: true },
          },
        },
        {
          test: /\.scss$/,
          use: [
            { loader: 'css-loader', options: { exportType: 'string', esModule: false } },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        ngDevMode: 'false',
        ngJitMode: 'false',
        ngI18nClosureMode: 'false',
      }),
      new AngularWebpackPlugin({
        tsconfig: path.resolve(__dirname, 'tsconfig.federation.json'),
        jitMode: false,
      }),
      new ModuleFederationPlugin({
        name: 'book_library',
        filename: 'remoteEntry.js',
        exposes: { './mount': './src/federation/mount.ts' },
        shared: {},
      }),
    ],
    devServer: {
      port: 4200,
      host: '0.0.0.0',
      headers: { 'Access-Control-Allow-Origin': '*' },
      allowedHosts: ['localhost', '127.0.0.1'],
      hot: false,
      liveReload: false,
      client: false,
    },
  };
};
