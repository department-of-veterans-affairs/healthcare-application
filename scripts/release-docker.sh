#!/bin/bash

set -e

SCRIPT_DIR=$(dirname $0)

${SCRIPT_DIR}/make-docker.sh
docker login -e ${DOCKER_EMAIL} -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
docker push 'dsva/healthcare-application:latest'
