const fs = require('fs-extra');
const path = require('path');

const webpack = require('webpack');
const bodyParser = require("body-parser")
const config = require('./webdev.config');
const envConfig = new Object();

const http = require('http');
const express = require('express');
const webpush = require('web-push');

function setupConfig () {
  config.api.set('output',config.output);
  config.api.set('entry',config.entry);
  config.api.set('module.rules', config.module.rules);
  config.api.set('plugins', config.plugins);
  config.api.set('resolve', config.resolve);
};

var LISTENING = false;

function flagMatcher (flag) {
  var name, val;
  [name, val] = flag.split('=');
  envConfig[name.replace(/\-+/,'')] = val || true;
}

function registerEnvironment (callback) {
  const environments = require(config.envFile);

  if (!environments[envConfig["env"]]) {
    console.warn("Not recognized environment declaration. Working with default config");
  };
  
  envConfig["env"] = env = Object.assign({ 
    name: 'development',
    apiURL: 'statics/data/',
    userURL: 'statics/user/',
    staticURL: 'statics/',
    port: 8050
  }, environments[envConfig["env"]]);

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

function attachLink (params, callback) {
  place = params.place == "head" || params.place == "body" ? params.place : "head"; 
  fs.readFile(path.resolve(config.distDir, 'index.html'), 'utf-8', (err, data) => {
    if (err) throw err;
    linkTag = `<link ${params.type && 'type="'+params.type+'"' || ''} ${params.href && 'href="'+params.href+'"' || ''} ${params.rel && 'rel="'+params.rel+'"' || ''} />`;
    data = data.replace(RegExp(`<!-- {{${place}}} -->`,'g'), `<!-- {{${place}}} -->\n ${linkTag}`);
    fs.writeFile(path.resolve(config.distDir, 'index.html'), data, err => {
      if (err) throw err;
      log('Link attached on ' + place);
      callback();
    });
  });
}

function attachScript (params, callback) {
  place = params.place == "head" || params.place == "body" ? params.place : "head"; 
  fs.readFile(path.resolve(config.distDir, 'index.html'), 'utf-8', (err, data) => {
    if (err) throw err;
    scriptTag = `<script ${params.type && 'type="'+params.type+'"' || ''} ${params.src && 'src="'+params.src+'"' || ''} ${params.rel && 'rel="'+params.rel+'"' || ''}>${params.script && params.script || ''}</script>`;
    data = data.replace(RegExp(`<!-- {{${place}}} -->`,'g'), `<!-- {{${place}}} -->\n${scriptTag}`);
    fs.writeFile(path.resolve(config.distDir, 'index.html'), data, err => {
      if (err) throw err;
      log('Script attached on ' + place);
      callback();
    });
  });
}

function setupDistDir (callback) {
  callback = callback || function () {};
  copyStaticDir(() => removeMainHash(callback));
};

function copyStaticDir (callback) {
  if (config.statics.copy) {
    let targetDir = path.resolve(config.distDir, config.statics.dist);
    fs.copy(config.statics.path, targetDir, (err, data) => {
      if (err) throw err;
      Promise.all(config.statics.exclude && config.statics.exclude.map(d => {
        return fs.remove(path.resolve(targetDir, d), (err) => {
          if (err) throw err;
        });
      })).then(_ => {
        log('Static directory copied into dist folder');
        callback();
      });
    });
    return;
  }
  callback();
};

function setupPWA (callback) {
  if (config.pwa.enabled === true) {
    const files = fs.readdirSync( config.pwa.path );
    const len = files.length-1;
    var counter = 0;
    files.forEach(function (file) {
        let sourceFile = path.join(config.pwa.path, file);
        fs.copy(sourceFile, path.resolve(config.distDir, file), (err, data) => {
          if (err) throw err;
          counter++;
          if (counter === len) {
            attachLink({
              place: 'head',
              rel: "manifest",
              href: 'manifest.json'
            }, () => {
              log('PWA setted up');
              callback && callback();
            });
          }
        });
    });
  } else {
    callback && callback();
  }
};

function removeMainHash (callback) {
  return fs.readFile(path.resolve(config.distDir, 'index.html'), 'utf-8', (err, data) => {
    if (err) throw err;
    data = data.replace(/main.js[^"]+/, `main.js`);
    fs.writeFile(path.resolve(config.distDir, 'index.html'), data, err => {
      if (err) throw err;
      log('Hash removed!');
      callback && callback()
    });
  });
}

function buildRegex (urlParam) {
  if ( urlParam ){
    return new RegExp("^\/" + urlParam + "\/(.*)");
  } else {
    return new RegExp("^" + "(.*)");
  }
};

function request (host, req, res, filePath) {
  if ( !host || (host === "localhost" || host === "local" || host == "127.0.0.1" )) {
    filePath = path.resolve(config.distDir, filePath);
    fs.exists(filePath, (exists) => {
      if (exists) {
        var stats = fs.statSync(filePath);
        if (!stats.isFile()) {
          res.sendStatus(404);
          return;
        };
      } else {
        if (req.headers["accept"] && req.headers["accept"].indexOf('text/html') >= 0) {
          filePath = path.resolve(config.root, config.distDir, 'index.html');
        } else {
          res.sendStatus(404);
          return;
        }
      }

      if ((req.headers["accept"] && req.headers["accept"].indexOf("image") >= 0) || reqFile(req.url)) {
          res.sendFile(filePath);
      } else {
        fs.readFile(filePath, 'utf-8', (err, data) => {
          res.send(data);
        });
      }

    });
  } else {
    let req = http.get(host+filePath, (_res) => {
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

function response (host, req, res, filePath) {
  if (envConfig.middleware) {
    let middleware = require( path.resolve( __dirname, 'middlewares', envConfig.middleware));
    middleware(req, res, (_req,_res) => {
      request(host, _req, _res, filePath);
    });
  } else {
    request(host, req, res, filePath);
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
    ".json":    "application/json",
    ".mp4":     "video/mp4",
    ".css":     "text/css"
  }

  ext = path.extname(req.originalUrl);
  if (Boolean(ext.length)) {
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Content-Type', MimeTypes[ext] || "text/plain");
  }
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
    res.type('text/html');
    response('', req, res, config.distDir + '/index.html', false);
  });

  app.get('(*)?/environment.js', (req, res) => {
    response('', req, res, config.distDir + '/environment.js', false);
  });

  app.get('(*)?/main.js', ( req, res ) => {
    response('', req, res, config.distDir + '/main.js', false );
  });

  app.post('/push-notification', function(req, res) {
    const subscription = req.body.subscription;
    const message = req.body.message;
    const vapid = require('../src/pwa/vapid.json');

    setInterval(() => {
      const options = {
        TTL: 24 * 60 * 60,
        vapidDetails: {
          subject: 'mailto:lucas@bestiario.com',
          publicKey: vapid.publicKey,
          privateKey: vapid.privateKey
        },
      }

      log('\nwebpush.sendNotification\n')
      webpush.sendNotification(
        subscription,
        JSON.stringify({
          message: message,
          title: "PUSH NOTIFICATION",
          icon: "2277f940a875f864ccf7280bd9c712b3.png",
          "tag": "simple-push-demo-notification-tag"
        }),
        options
      ).catch(err => {
        console.log('push sent went wrong');
      });

    }, 60000);
  
    res.send('{"success": true}');
  });
  
  app.get(buildRegex(), (req, res) => {
    var filePath = req.params[0];
    if (!envConfig.env.host || envConfig.env.host === "localhost" || envConfig.env.host === "local") {
      // LOCAL HOST
      envConfig.env.host = envConfig.env.host || "localhost";
      filePath = path.resolve(config.distDir, filePath.replace(/^\//,''));
      response(envConfig.env.host, req, res, filePath);
    } else {
      // REMOTE HOST
      response(envConfig.env.host, req, res, filePath);
    }
  });

  app.post(buildRegex(), (req, res) => {
    var filePath = req.params[0];
    if (!envConfig.env.host || envConfig.env.host === "localhost" || envConfig.env.host === "local") {
      // LOCAL HOST
      envConfig.env.host = envConfig.env.host || "localhost";
      filePath = path.resolve(config.distDir, filePath.replace(/^\//,''));
      response(envConfig.env.host, req, res, filePath);
    } else {
      // REMOTE HOST
      response(envConfig.env.host, req, res, filePath);
    }
  });

  app.set('port', envConfig.env.port);

  return app;
;}

function main () {
  // register env flags as config object
  process.argv.slice(2).forEach(function (val, index, array) {
    flagMatcher(val);
  });
  
  var compiler;

  if (envConfig["dev"]) {
    function callback () {
      const app = setupApp();
      
      config.api.set("watch", true);
      config.api.set("mode", "development");

      setupConfig();

      function startApp () {
        if (LISTENING) return;
        // Setup the development server.
        server = http.createServer(app);

        //setup dist directory
        //start app
        setupDistDir(() => {
          server.listen(app.get('port'), function () {
            log('Webpack watching for changes and app listening on port '+envConfig.env.port+'!\n');
            LISTENING=true;
          });
        })
      };

      compiler = webpack(config.api.get(), (err, stats) => {
        if (err) throw err;
        removeMainHash();
        log('Webpack compiled');
        setupPWA(() => startApp());
      });
    }
  } else if (envConfig["build"]){
    function callback () {
      config.api.set("mode", envConfig["prod"] && "production" || "development");

      setupConfig();

      compiler = webpack(config.api.get(), ( err, stats ) => {
        if (err) throw err
        setupDistDir(setupPWA);
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

function reqFile (url) {
  return url && Array.isArray(/(jp(e)?g|png|gif|ti(f)+|svg|mp[3-4]|avi|mov|woff(2)?|ttf|eot)/.exec(url)) || false;
}