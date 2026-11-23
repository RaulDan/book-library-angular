const { container } = require('webpack');

module.exports = {
  output: {
    uniqueName: 'book_library',
    publicPath: 'auto',
    module: true,
  },
  experiments: { outputModule: true },
  optimization: { runtimeChunk: false },
  plugins: [
    new container.ModuleFederationPlugin({
      name: 'book_library',
      filename: 'remoteEntry.js',
      library: { type: 'module' },
      exposes: { './mount': './src/federation/mount.ts' },
      shared: {},
    }),
  ],
  devServer: {
    allowedHosts: ['localhost', '127.0.0.1'],
    headers: { 'Access-Control-Allow-Origin': '*' },
    client: false,
    webSocketServer: false,
    hot: false,
  },
};
