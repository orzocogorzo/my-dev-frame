const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackLiveReload = require('webpack-livereload-plugin');

const config = {
	distDir: path.resolve(__dirname, 'dist'),
  srcDir: path.resolve(__dirname, 'src'),
  dataDir: path.resolve(__dirname, 'src/data'),
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
  },
  envFile: path.resolve(__dirname, 'environments.js'),
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'dist/'), { 
      root: path.resolve(__dirname),
      exclude: ['environment.js']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      minify: true,
      hash: true,
      cache: true
    }),
    new WebpackLiveReload({
      port: 35729,
      host: "localhost",
      appendScriptTag: true,
      delay: 200
    })
  ],
  context: path.resolve(__dirname),
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  }
}

module.exports = config;
