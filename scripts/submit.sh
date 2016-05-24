#!/bin/bash
# Usage: ./submit.sh FILE
# Posts FILE (containing JSON data in the format used by the veteran form store)
# to a local instance of the backend server.
# Prints backend results upon completion.
[ ! -r "$1" ] && exit 1
curl -X POST --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  -d "$(cat $1)" \
  "http://localhost:3000/api/hca/v1/application"
echo
