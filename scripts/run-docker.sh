#!/bin/bash

set -e

PORT=3000
HOST_IP_PREFIX=""  # Only needed if using docker-machine.

# docker-machine is not installed on linux. Use the presence
# of the command to determine if docker's port publication
# requires a specific IP address instead of just binding to
# the default interfaces.
if (which -s 'docker-machine'); then
  HOST_IP_PREFIX="$(docker-machine ip):"
  if [ $HOST_IP_PREFIX = ":" ]; then
    echo "'docker-machine ip' did not yield an IP adderess"
    exit 1
  fi
fi

docker run --rm -p ${HOST_IP_PREFIX}3000:3000 -t 'awongdev/hca-staging'
