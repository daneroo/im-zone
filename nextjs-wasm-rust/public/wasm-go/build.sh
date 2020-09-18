#!/bin/sh

echo "-= Copying wasm_exec.js"
cp -p "$(go env GOROOT)/misc/wasm/wasm_exec.js" .

echo "-= Compiling main.wasm with Go"
GOOS=js GOARCH=wasm go build -o main.wasm ./main.go

echo "-= Copying tinygo's wasm_exec.js"
docker run -v $(pwd):/src  tinygo/tinygo:0.15.0 /bin/bash -c "cp -p /usr/local/tinygo/targets/wasm_exec.js /src/wasm_exec_tinygo.js"

echo "-= Compiling tinygo.wasm with TinyGo"
docker run --rm -v $(pwd):/src tinygo/tinygo:0.15.0 tinygo build -o /src/tinygo.wasm -target=wasm /src/main.go
