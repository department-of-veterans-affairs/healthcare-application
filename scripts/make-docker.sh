#!/bin/bash

set -e

npm run webpack
mv npm-shrinkwrap.json npm-shrinkwrap.json.old
npm shrinkwrap
docker build -t 'dsva/healthcare-application:latest' .
mv npm-shrinkwrap.json.old npm-shrinkwrap.json
