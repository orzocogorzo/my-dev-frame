#! /bin/bash

env=$1

function deploy {
  mkdir -p ../server/statics/admin
  rm -rf ../server/statics/admin/*
  cp -rf admin/dist/* ../server/statics/admin
}

if [ $env = 'py' ]; then
  export NODE_ENV=development
  node admin/express/app.js --dev --env=dev:py

elif [ $env = 'pre' ]; then
  export NODE_ENV=production
  export BASE_HREF='/dlab5g/admin/'
  node admin/express/app.js --build --prod --env=heroku
  echo 'setup deploy directories structure'
  deploy

elif [ $env = 'pro' ]; then
  export NODE_ENV=production
  export BASE_HREF='/dlab5g/admin/'
  node admin/express/app.js --build --prod --env=pro
  echo 'setup deploy directories structure'
  deploy

elif [ $env = 'local' ]; then
  export NODE_ENV=local
  export BASE_HREF='/admin/'
  node admin/express/app.js --build --prod --env=local
  echo 'setup deploy directories structure'
  deploy

else
  export NODE_ENV=development
  node admin/express/app.js --dev --env=dev

fi
