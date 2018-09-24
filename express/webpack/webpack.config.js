const path = require('path');

const config = {
  module: {
    rules: [
      { 
        test: /\.(styl|css)$/, 
        use: ['style-loader','css-loader','stylus-loader'] 
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|woff(2)?|ttf|eot)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
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
};

const API = (function(cfg){
  const _config = cfg;
  const _this = {};

  function getter (strPath) {
    let path = strPath.split('.');
    let val = _config[path[0]];
    for (let k of path.slice(1)) {
      val = _config[k];
    };
    return val;
  }

  function setter (strPath, val) {
    let path = strPath.split('.');
    let last_k = path.pop();
    let _val = _config;
    for (let k of path) {
      _val = _val[k];
    };

    if (_val[last_k]) {
      if (Array.isArray(_val[last_k])) {
        _val[last_k] = _val[last_k].concat(val);
      } else if (typeof _val[last_k] === "object" && _val[last_k].constructor === Object) {
        Object.assign(_val[last_k], val);
      } else {
        _val[last_k] = val;
      }
    } else {
      _val[last_k] = val;
    }
  }

  _this.get = function (k) {
    if (k) {
      return getter(k);
    } else {
      return _config;
    }
  };

  _this.set = function (key, val) {
    setter(key, val);
  };

  return _this;

})(config);

module.exports = API;
