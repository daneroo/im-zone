#!/usr/bin/env bash

# nodemon --watch src --watch main.go --exec ./build.sh


echo "-=-= Clean dist/"
rm -rf dist

echo "-=-= Build Go"
(cd lib/wasm-go; ./build.sh)

echo "-=-= Bundling JavaScript"
npm run bundle
