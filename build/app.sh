#! /bin/bash

env=$1

function deploy {
  mkdir -p ../server/statics/app
  rm -rf ../server/statics/app/*
  cp -rf dist/* ../server/statics/app
}

if [ $env = 'py' ]; then
  export NODE_ENV=development
  node express/app.js --dev --env=dev:py

elif [ $env = 'pre' ]; then
  export NODE_ENV=production
  export BASE_HREF='/dlab5g/app/'
  node express/app.js --build --env=heroku
  echo 'setup deploy directories structure'
  deploy

elif [ $env = 'pro' ]; then
  export NODE_ENV=production
  export BASE_HREF='/dlab5g/app/'
  node express/app.js --build --env=pro
  echo 'setup deploy directories structure'
  deploy

elif [ $env = 'local' ]; then
  export NODE_ENV=local
  export BASE_HREF='/app/'
  node express/app.js --build --prod --env=local
  echo 'setup deploy directories structure'
  deploy

else
  export NODE_ENV=development
  node express/app.js --dev --env=dev

fi
