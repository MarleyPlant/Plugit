#!/usr/bin/env bash

# run the relevant git commands to download the submodules
git submodule init
git submodule update

# install the node dependancies so that styles can be compiled
npm install
