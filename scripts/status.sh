#!/bin/bash
# Usage: ./status.sh FORMSUBMISSIONID
# Creates a GET request from the provided FORMSUBMISSIONID.
# Prints backend results upon completion.
[ "$1" = "" ] && exit
curl -X GET --header "Accept: application/json" \
  "http://localhost:3000/api/hca/v1/VoaServices/status?request=%7B%22formSubmissionId%22%3A"$1"%7D"
echo
