const path = require('path');
const wpAPI = require('./webpack/webpack.config');
const user_config = require('../webdev.config');

// replace default parametters with the iser configuration
const config = Object.assign({
	distDir: 'dist',
  srcDir: 'src',
  dataDir:'src/data',
  entry: "src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  envFile: './environments.js', 
  module: {
    rules: []
  },
  plugins: [],
  api: wpAPI
}, user_config);

module.exports = config;
