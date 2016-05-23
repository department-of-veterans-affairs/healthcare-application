#!/bin/bash
# Usage: ./status.sh FORMSUBMISSIONID
# Creates a GET request from the provided FORMSUBMISSIONID.
# Prints backend results upon completion.
[ "$1" = "" ] && exit
curl -X GET --header "Accept: application/json" \
  "http://localhost:3000/api/hca/v1/application/$1"
echo
