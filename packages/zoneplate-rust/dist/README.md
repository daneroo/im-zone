# Zone Plate Generator in Rust/WASM

Simply uses `wasm-pack build` to prepare the node package.

## TODO

- Combine with my own entry point?
- Describe the rust toolchain requirements for building

## Usage

```js
```

## Packaging

By default `wasm-pack` creates a `pkg` directory which is meant to be published and `.gitignore`d.

We have renamed the output to `dist/` folder, and also keep the compiled package in version control so that the rust toolchain is not required, unless actual compilation is needed.

Also, the package.json which is generated was cloned into the root directory, and modified to include the source and a slightly modified entrypoint.
