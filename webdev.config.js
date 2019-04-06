const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackLiveReload = require('webpack-livereload-plugin');
var webpack = require('webpack')

const config = {
	distDir: path.resolve(__dirname, 'dist'),
  srcDir: path.resolve(__dirname, 'src'),
  dataDir: path.resolve(__dirname, 'src/data'),
  staticDir: {
    path: path.resolve(__dirname, 'src/static'),
    copy: true,
    exclude: ["images"]
  },
  pwa: {
    path: path.resolve(__dirname, 'src/pwa'),
    enabled: true
  },
  entry: {
    main: ['@babel/polyfill', path.resolve(__dirname, "src/index.js")],
    pwa: path.resolve(__dirname, "src/pwa/sw.js")
  },
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
      cache: true,
      title: "My Dev Frame"
    }),
    new WebpackLiveReload({
      port: 35729,
      host: "localhost",
      appendScriptTag: true,
      delay: 200
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          import: [path.resolve(__dirname, 'src/styles/main.styl')]
        }
      }
    }),
    new webpack.ProvidePlugin({
      'moment': 'moment'
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
