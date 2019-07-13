const path = require('path');
const wpAPI = require('./webpack/webpack.config');
const user_config = require('../webdev.config');

// replace default parametters with the iser configuration
const config = Object.assign({
	distDir: path.resolve(__dirname, 'dist'),
  srcDir: path.resolve(__dirname, 'src'),
  statics: {
    path: path.resolve(__dirname, 'src/statics'),
    dist: path.resolve(__dirname, 'dist/statics'),
    copy: true,
    exclude: []
  },
  pwa: {
    path: path.resolve(__dirname, 'src/pwa'),
    enabled: false
  },
  entry: {
    main: ['@babel/polyfill', path.resolve(__dirname, "src/index.js")],
    // pwa: path.resolve(__dirname, "src/pwa/sw.js")
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: 'main.js',
    // publicPath: 'admin/'
    chunkFilename: '[name].bundle.js',
    filename: '[name].bundle.js'
  },
  envFile: path.resolve(__dirname, 'environments.js'),
  module: {
    rules: []
  },
  plugins: [],
  context: path.resolve(__dirname),
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  api: wpAPI
}, user_config);

module.exports = config;
