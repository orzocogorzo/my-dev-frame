#! /bin/bash

if [[ $1 = 'dev' ]]; then
  file=prod.config.py

elif [[ $1 = 'pre' ]]; then
  file=pre.config.py

elif [[ $1 = 'pro' ]]; then
  file=prod.config.py

else
  file=prod.config.py

fi

.venv/bin/gunicorn --config server/config/$file wsgi:application