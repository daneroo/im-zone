# Zone Plate -  Next.js WASM and Rust

Deployed to <https://zone.v.imetrical.com/>

In dev mode, this has continuous recompilation enabled, including the rust wasm.

However if`next.config.js::webpack.WasmPackPlugin.forceMode = 'production`, we need to reload the page for the wasm import to be refreshed.

## TODO

- Better static deploy to vercel from `out/`
- Styling
- History (with scans and pictures)

## Usage

Start the dev server and visit <http://localhost:8080>

```bash
npm run dev
```

For production (creates an `./out/` directory):

```bash
npm run deploy:vercel
```

## Setup

We added a[custom webpack config for next.js][nxdoc]
to replicate [the JuliaSet wasm-bindgen example configuration][wsmdoc]

[nxdoc]: https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
[wsmdoc]: https://rustwasm.github.io/docs/wasm-bindgen/examples/julia.html

The initial next.js scaffolding was [created with][nxeg]:

[nxeg]: https://github.com/vercel/next.js/tree/canary/examples/with-webassembly

You need a working rust installation with target for WASM,
and `wasm-pack` npm module must be available on path (so `-g`)

```bash
npm i -g wasm-pack
npx create-next-app --example with-webassembly with-webassembly-app
```
