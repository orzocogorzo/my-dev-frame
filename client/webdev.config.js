const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackLiveReload = require('webpack-livereload-plugin');
var webpack = require('webpack')

const config = {
	distDir: path.resolve(__dirname, 'dist'),
  srcDir: path.resolve(__dirname, 'src'),
  statics: {
    path: path.resolve(__dirname, 'src/statics'),
    dist: path.resolve(__dirname, 'dist/statics'),
    copy: true,
    exclude: ["fonts","media","svg"]
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
      title: "MOAI Analytics",
      base: `<base href="${process.env.BASE_HREF || ''}" />`
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
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      DEBUG: process.env.DEBUG
    })
  ],
  context: path.resolve(__dirname),
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // }
}

module.exports = config;
