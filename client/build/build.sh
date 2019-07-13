#! /bin/bash

env=$1

ORIGIN=$PWD
PROJ_DIRNAME="$(cd $(dirname "${BASH_SOURCE[0]}") && cd .. && pwd)"
cd $PROJ_DIRNAME

function deploy {
  mkdir -p ../server/statics
  rm -rf ../server/statics/*
  cp -rf dist/* ../server/statics
}

if [[ $env = 'dev' ]]; then
  export NODE_ENV='development'
  node express/app.js --build --env=dev
  echo 'setup deploy directories structure'
  deploy

elif [[ $env = 'pro' ]]; then
  export NODE_ENV='production'
  node express/app.js --build --env=pro
  echo 'setup deploy directories structure'
  deploy

else
  export NODE_ENV='development'
  node express/app.js --build --env=dev
  echo 'setup deploy directories structure'
  deploy
fi

cd $ORIGIN