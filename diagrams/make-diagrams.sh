#!/bin/bash

# Script to turn all .puml files in this directory into .png files.
# Just run it like "./make-diagrams.sh"

# My instinct are to make a Makefile, but I'm a dinosaur, so here's a
# shell script.

# look for graphviz
which dot > /dev/null
if [ $? != 0 ]
then
  echo "'dot' from graphviz not found"
  echo "On OSX, run 'brew install graphviz'"
  exit
fi

# look for plantuml
which plantuml > /dev/null
if [ $? != 0 ]
then
  echo "'plantuml' not found"
  echo "On OSX, run 'brew install plantuml'"
  exit
fi

for i in *.puml
do
  plantuml -tpng $i
  if [ $? != 0 ]
  then
    echo "Something didn't work. Fix error and re-run."
    exit
  fi
done
