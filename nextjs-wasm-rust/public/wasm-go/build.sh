#!/bin/sh

echo "-= Copying wasm_exec.js"
cp -p "$(go env GOROOT)/misc/wasm/wasm_exec.js" .

echo "-= Compiling main.wasm with Go"
GOOS=js GOARCH=wasm go build -o main.wasm ./main.go

echo "-= Compiling tinygo.wasm with TinyGo"
docker run --rm -v $(pwd):/src tinygo/tinygo:0.15.0 tinygo build -o /src/tinygo.wasm -target=wasm /src/main.go
