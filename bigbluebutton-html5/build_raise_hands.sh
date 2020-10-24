#!/bin/bash

echo "Ensuring correct cwd"
cd /home/dev/dev/bigbluebutton/bigbluebutton-html5

echo "Building into ./build/"
meteor build --server-only ./build/
