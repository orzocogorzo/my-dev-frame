#! /bin/bash

env=$1

function deploy {
  mkdir -p ../server/statics
  rm -rf ../server/statics/statics  ../server/statics/*.html ../server/statics/*.js
  cp -rf umbrella/dist/* ../server/statics
}

if [ $env = 'py' ]; then
  export NODE_ENV=development
  node umbrella/express/app.js --dev --env=dev:py

elif [ $env = 'pre' ]; then
  export NODE_ENV=production
  export BASE_HREF='/dlab5g/'
  node umbrella/express/app.js --build --prod --env=heroku
  echo 'setup deploy directories structure'
  deploy

elif [ $env = 'pro' ]; then
  export NODE_ENV=production
  export BASE_HREF='/dlab5g/'
  node umbrella/express/app.js --build --prod --env=pro
  echo 'setup deploy directories structure'
  deploy

elif [ $env = 'local' ]; then
  export NODE_ENV=local
  node umbrella/express/app.js --build --prod --env=local
  echo 'setup deploy directories structure'
  deploy

else
  export NODE_ENV=development
  node umbrella/express/app.js --dev --env=dev

fi
