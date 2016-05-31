#!/bin/bash

# Creates a new base build environment image ready for use in Travis.
# This creates and pushes 2 images: build-full and build-cached.

# The build-full image contains all the supporting binaries needed to run
# an npm install from scratch including things like gcc, python, make,
# etc.
#
# The build-cached image contains just the node_modules directory that
# results from creating the build-full image. This is all that is needed
# to run the healthcare-application build scripts and servers and is
# a few hundred megabytes smaller than the full image making for much
# faster and reliable Travis runs.
#
# Only build-cached is pushed to docker hub as the full build is not
# really useful.

set -xe

FULL_BUILD_IMAGE=dsva/healthcare-application:build-full
CACHED_BUILD_IMAGE=dsva/healthcare-application:build-cached
NODE_MODULES_TAR=docker-travis-build/node_modules.tar

# Create a fresh new Alpine Linux based install of all the npm dependencies.
docker build -f Dockerfile.build -t "${FULL_BUILD_IMAGE}" .

# Spin up a container so it mounts the image in a way that can files can be copied
# from it. Then delete it after the files are copied out.
docker run --name hca-build-temp "${FULL_BUILD_IMAGE}" echo hi
docker cp hca-build-temp:/src/healthcare-application/node_modules - > "${NODE_MODULES_TAR}"
docker rm hca-build-temp

docker build -f Dockerfile-cached-npm.build -t "${CACHED_BUILD_IMAGE}" .

docker push ${CACHED_BUILD_IMAGE}
