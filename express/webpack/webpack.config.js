const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  // entry: './src/scripts/index.js',
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: 'main.js'
  // },
  module: {
    rules: [
      { 
        test: /\.styl$/, 
        use: 'style-loader!css-loader!stylus-loader' 
      },
      {
        test: /\.css$/,
        use: 'style-loader!css-loader!'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
    // },
  // plugins: [
  //   new CleanWebpackPlugin('dist/', { 
  //     root: path.resolve(__dirname),
  //     exclude: ['environment.js']
  //   }),
  //   new HtmlWebpackPlugin({
  //     filename: 'index.html',
  //     template: 'index.html',
  //     minify: true,
  //     hash: true,
  //     cache: true
  //   })
  // ]
};

const API = (function(cfg){
  const _config = cfg;
  const _this = {};

  function getter( strPath ){
    let path = strPath.split('.');
    let val = _config[path[0]];
    for (let k of path.slice(1)){
      val = _config[k];
    };
    return val;
  }

  function setter( strPath, val ) {
    let path = strPath.split('.');
    let last_k = path.pop();
    let _val = _config;
    for (let k of path){
      _val = _val[k];
    };

    if ( _val[last_k] ) {
      if ( Array.isArray(_val[last_k]) ) {
        _val[last_k] = _val[last_k].concat(val);
      } else if (typeof _val[last_k] === "object" && _val[last_k].constructor === Object){
        Object.assign(_val[last_k], val);
      } else {
        _val[last_k] = val;
      }
    } else {
      _val[last_k] = val;
    }
  }

  _this.get = function( k ){
    if ( k ) {
      return getter( k );
    } else {
      return _config;
    }
  };

  _this.set = function( key, val ){
    setter( key, val );
  };

  return _this;

})( config );

module.exports = API;
