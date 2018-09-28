const fs = require('fs-extra');
const path = require('path');

const webpack = require('webpack');
const bodyParser = require("body-parser")
const config = require('./webdev.config');
const envConfig = new Object();

const http = require('http');
const express = require('express');

function setupConfig(){
  config.api.set('output',config.output);
  config.api.set('entry',config.entry);
  config.api.set('module.rules', config.module.rules);
  config.api.set('plugins', config.plugins);
  config.api.set('resolve', config.resolve);
};

var LISTENING=false;

function flagMatcher(flag){
  let name,val;
  [name,val] = flag.split('=');
  envConfig[name.replace(/\-+/,'')] = val || true;
}

function registerEnvironment (callback) {
  const environments = require(config.envFile);

  if (!environments[envConfig["env"]]) {
    console.warn("Not recognized environment declaration. Working with default config");
  };
  
  envConfig["env"] = env = environments[envConfig["env"]] || { 
    name: 'development',
    apiURL: 'rs/json'
  };

  if (!fs.existsSync(config.distDir)) {
    fs.mkdirSync(config.distDir);
  };

  fs.writeFile(path.resolve(config.distDir, 'environment.js'), ' window.environment='+JSON.stringify(env)+';', function (err) {
    if (err) {
      log('Error on writing env dist file\n');
      return;
    };

    log('Environment variable registered with exit. Defined as ' + env.name);
    callback();
  });
}

function attachScript (script, place, src, callback) {
  place = place == "head" || place == "body" ? place : "head"; 
  fs.readFile(path.resolve(config.distDir, 'index.html'), 'utf-8', (err, data) => {
    if (err) throw err;
    scriptTag = `<script src="${src}" type="application/javascript">${script}</script>`;
    data = data.replace(RegExp(`<!-- {{${place}}} -->`,'g'), `<!-- {{${place}}} -->\n${scriptTag}`);
    fs.writeFile(path.resolve(config.distDir, 'index.html'), data, err => {
      if (err) throw err;
      log('Script attached on ' + place);
      callback()
    });
  });
}

function setupPWA () {
  fs.readFile(path.resolve(__dirname, '../pwa/manifest.json'), 'utf-8', (err, data) => {
    if (err) throw err;
    fs.writeFile(path.resolve(config.distDir, 'manifest.json'), data, function(err) {
      if (err) throw err;
      fs.copy(path.resolve(__dirname, '../pwa/icons'), path.resolve(config.distDir, 'icons'), err => {
        if (err) throw err;
        fs.readFile(path.resolve(__dirname, '../pwa/service-worker.js'), 'utf-8', (err, data) => {
          if (err) throw err;
          fs.writeFile(path.resolve(config.distDir, 'service-worker.js'), data, function (err) {
            if (err) throw err;
            log('PWA setted up!');
          });
        });
      });
    });
  });
}

// function moveStaticsDir (callback) {
//   fs.copy(path.resolve(config.srcDir, 'static'), path.resolve(config.distDir, 'static'), callback);
// };

function setupDistDir (callback) {
  // attachScript('', 'body','http://localhost:35729/livereload.js', callback, () => callback)
  removeMainHash(callback)
};

function removeMainHash (callback) {
  return fs.readFile(path.resolve(config.distDir, 'index.html'), 'utf-8', (err, data) => {
    if (err) throw err;
    data = data.replace(/main.js[^"]+/, 'main.js');
    fs.writeFile(path.resolve(config.distDir, 'index.html'), data, err => {
      if (err) throw err;
      log('Hash removed!');
      callback()
    });
  });
}

function buildRegex (urlParam) {
  let basehref = envConfig.basehref || envConfig.env.basehref || null
  if ( urlParam ){
    return new RegExp("^\/" + (basehref && (basehref + "/" + urlParam)
      || urlParam) + "\/(.*)");
  } else {
    return new RegExp("^" + (basehref && ("\/" + basehref) || '') + "(.*)");
  }
};

function request (host, req, res, filePath, redirect) {
  if ( !host || (host === "localhost" || host === "local" || host == "127.0.0.1" )) {
    filePath = path.resolve(config.distDir, filePath);
    fs.exists(filePath, (exists) => {
      if (exists) {
        var stats = fs.statSync(filePath);
        if (!stats.isFile()) {
          if (redirect) {
            filePath = path.resolve(config.root, config.distDir, 'index.html');
          } else {
            res.sendStatus(404);
            return;
          }
        };
      } else {
        if (redirect) {
          filePath = path.resolve(config.root, config.distDir, 'index.html');
        } else {
          if (req.headers["accept"].indexOf('text/html') >= 0) {
            filePath = path.resolve(config.root, config.distDir, 'index.html');
          } else {
            res.sendStatus(404);
            return;
          };

        }
      };
      if (req.headers["accept"].indexOf("image") >= 0) {
          res.sendFile(filePath);
      } else {
        fs.readFile(filePath, 'utf-8', (err, data) => {
          res.send(data);
        });
      }

    });
  } else {
    let req = http.get(host+filePath, ( _res ) => {
      _res.setEncoding("utf8");
      let body = "";
      _res.on("data", data => {
        body += data;
      }).on("end", () => {
        res.send(body);
      });
    });

    req.on('error', function (e) {
      log('ERROR: ' + e.message);
    });
  }
};

function response (host, req, res, filePath, redirect) {
  if (envConfig.middleware) {
    let middleware = require( path.resolve( __dirname, 'middlewares', envConfig.middleware));
    middleware(req, res, (_req,_res) => {
      request(host, _req, _res, filePath, redirect);
    });
  } else {
    request(host, req, res, filePath, redirect);
  }
};

function setResponseContentType (req, res) {
  MimeTypes = {
    ".js":      "application/javascript",
    ".html":    "text/html",
    ".svg":     "image/svg+xml",
    ".png":     "image/png",
    ".jpeg":    "image/jpeg",
    ".jpg":     "image/jpeg",
    ".gif":     "image/gif",
    ".json":    "application/json"
  }

  ext = path.extname(req.originalUrl)
  if (Boolean(ext.length)) {
    res.append('Content-Type', MimeTypes[ext] || "text/plain");
    // res.type(MimeTypes[ext]);
    // res.header('Content-Type', MimeTypes[ext]);
  }
}

function getMongoDB () {
  var URI = process.env.MONGODB_URI; 
  MongoClient.connect(URI, function(err, db) {
    if (err) throw err;
    database = db.db("heroku_k9l4gvz8");
  });
}

function setupApp () {
  var app = express();
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    setResponseContentType(req, res);
    next();
  });

  app.get('/', (req, res) => {
    // res.header('Content-Type','text/html');
    res.type('text/html');
    response('', req, res, config.distDir + '/index.html', false);
  });

  app.get('/environment.js', (req, res) => {
    // res.header('Content-Type','application/javascript');
    response('', req, res, config.distDir + '/environment.js', false);
  });

  app.get('/main.js', ( req, res ) => {
    // res.header('Content-Type','application/javascript');
    response('', req, res, config.distDir + '/main.js', false );
  });

  // app.get('/service-worker.js', ( req, res ) => {
  //   res.header('Content-Type','text/javascript');
  //   response( envConfig.env.host, req, res, config.distDir + '/service-worker.js', false );
  // });

  // app.get('/icons/:icon', ( req, res ) => {
  //   res.header('Content-Type','image/png');
  //   res.sendFile( path.resolve( config.distDir, 'icons', req.params.icon ) );
  //   // response( envConfig.env.host, req, res, config.distDir + '/icons/' + req.params.icon, false );
  // });

  // app.post('/bulk', ( req, res ) => {
  //   if ( database ) {
  //     database.collection('responses').insertOne( req.body, function( err, source ) {
  //       if ( err ) throw err;
  //       res.sendStatus(200);
  //     });
  //   } else {
  //     log( req.body );
  //     res.sendStatus(200);
  //   }
  // });
  
  app.get(buildRegex(), (req, res) => {
    var redirectPath = req.params[0].replace(new RegExp(`\/${envConfig.env.basehref}\/`),'');
    if (!envConfig.env.host || (envConfig.env.host != "localhost" && envConfig.env.host != "local")) {
      if (redirectPath.indexOf(envConfig.env.apiURL) >= 0) {
        // Local API ROUTE
        redirectPath = redirectPath.replace(new RegExp(`\/${envConfig.env.apiURL}\/`),'');
        response(envConfig.env.host, req, res, config.dataDir + '/' + redirectPath, false);
      } else {
        response(envConfig.env.host, req, res, config.distDir + redirectPath, !Boolean(redirectPath) || redirectPath === '/');
      }
    } else {
      response(envConfig.env.host, req, res, redirectPath, !Boolean(redirectPath) || redirectPath === '/');
    }
  });

  app.set('port', envConfig.port);

  return app;
;}

function main () {
  // register env flags as config object
  process.argv.slice(2).forEach(function (val, index, array) {
    flagMatcher(val);
  });
  
  var compiler;

  if (envConfig["dev"] || !envConfig["build"]) {

    if (!envConfig["dev"]) {
      console.warn("Unrecognized target action. Fired development mode by default");
    };

    if (!envConfig.port) {
      envConfig.port = 8000;
      console.warn("Port not declared, set port 8000 by default")
    }

    function callback () {
      const app = setupApp();
      
      config.api.set("watch", true);
      config.api.set("mode", "development");

      setupConfig();

      function startApp () {
        if (LISTENING) return;
        // Serve the files on port 8000.
        server = http.createServer(app);

        //remove hash
        //attach livereload script
        //start app
        setupDistDir(() => {
          server.listen(app.get('port'), function () {
            log('Webpack watching for changes and app listening on port '+envConfig.port+'!\n');
            LISTENING=true;
          });
        })
      };

      compiler = webpack(config.api.get(), (err, stats) => {
        if (err) throw err;
        log('Webpack compiled')
        startApp();
      });
    }
  } else if (envConfig["build"]){
    function callback(){
      
      config.api.set("mode", envConfig["prod"] && "production" || "development");

      setupConfig();

      compiler = webpack( config.api.get(), ( err, stats ) => {
        if (err) throw err
        log("Webpack build end with exit status");
      });
    }
  }

  registerEnvironment(callback);
}

// run the application
main();

function log (msg) {
  date = `${new Date().getHours()}:${new Date().getMinutes()}`
  console.log(`${date} - ${msg}`);
}
