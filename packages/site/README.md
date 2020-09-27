# Zone Plate -  Next.js WASM and Rust

Deployed to <https://zone.v.imetrical.com/>

In dev mode, this has continuous recompilation enabled, including the rust wasm.

However if`next.config.js::webpack.WasmPackPlugin.forceMode = 'production`, we need to reload the page for the wasm import to be refreshed.

Sometimes need to `rm -rf .next/ target/` and restart dev server (multiple times?)

*Performance*: `npx serve out` and the *vercel*-deployed version seems to be faster than `npm build && npm start`

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

These are project level configuration notes, which I could move to pages/about.mdx

### Initialize with webpack for WASM/Rust

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

### Deploy to vercel

To get node-canvas to work on lambda/vercel api routes need this special build:
_although fonts are not working_

```json
 "vercel-build": "yum install libuuid-devel libmount-devel && cp /lib64/{libuuid,libmount,libblkid}.so.1 node_modules/canvas/build/Release/ && npm run build",
```

### theme-ui

- `npm i  theme-ui @theme-ui/presets`
- Added `./styles/theme.js`
- Wrapped `ThemeProvider` in `./pages/_app.js`

### MDX

Using `@next/mdx` [plugin](https://www.npmjs.com/package/@next/mdx)

- `npm install --save @next/mdx @mdx-js/loader`
- wrap `next.config.js` object `withMDX()`
  - optionally add `remarkPlugins` and `rehypePlugins`
  - add config.pageExtensions:[...,''mdx] for top level .mdx pages
- Check for interaction with theme-ui

### Switching to tinygo

See `build.sh` file for docker invocation example

There is a brew tap, but replaced it with docker solution

```bash
brew tap tinygo-org/tools
brew install tinygo
tinygo version

tinygo build -o ...
```

## References

- <http://downloads.bbc.co.uk/rd/pubs/reports/1978-23.pdf>
