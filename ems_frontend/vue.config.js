const fs = require('fs');

const packageJson = fs.readFileSync('./package.json');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

const version = JSON.parse(packageJson).version || 0;

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: `"${version}"`,
        },
      }),
    ],
  },
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://localhost:3000',
      },
    },
  },
};
