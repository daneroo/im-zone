# Zone plate generation

- [Deployed as a Vercel Next.js (w/Rust/WASM) site](https://zone.v.imetrical.com/)
- [Deployed as a Vercel Next.js slide deck](https://zone-deck.v.imetrical.com/)
- Next.js - WASM - Rust - Go: `./packages/*`
- Static image/video generation in Go: `./static-go/`
- Original `C++` code from CRC in `./legacy-CRC/` _circa 1996_
- Original `Fortran` version: _lost_, but if I had it, I would dockerize it!

|                             VT Zone Plate                              |                             VH Zone Plate                              |
| :--------------------------------------------------------------------: | :--------------------------------------------------------------------: |
| <img src="./vt-zone.gif" alt="VT zone plate" width="200" height="200"> | <img src="./vh-zone.gif" alt="VH zone plate" width="200" height="200"> |

## TODO

- SVG with babel for zeit.svg error - <https://github.com/vercel/next.js/tree/canary/examples/svg-components>
- Final DNS names, remove imetrical, daneroo.com daneroo.vercel?
- npm packages
  - normalize the README
  - normalize the package.json scripts - dev build lint test
- api route for for go/wasm
- alternate backends
  - netlify <https://github.com/netlify/next-on-netlify>
  - Google Cloud Run (Docker)
- replaced zoneplate-go wasm with rollup-plugin-base64
  - need a plugin to move to /static/wasm/...wasm
- measure performance without/less annotations, or without impact..
- minimal testing (unit & integration)
- Go: try to find a zero allocation model (especially for tinyGo)
  - go still allocates the array, and the copies it into the passed Uint8ClampedArray
  - Replace wasm_exec with ... a real module
  - [webpack go loader npm](https://github.com/aaronpowell/webpack-golang-wasm-async-loader)
  - [webpack go loader blog](https://www.aaron-powell.com/posts/2019-02-12-golang-wasm-6-typescript-react/)
- Exploit symmetry in zone
- [Review Styling](https://www.smashingmagazine.com/2020/09/comparison-styling-methods-next-js/)
- Content
  - History add scans and pictures
  - Add performance comparative benchmarks (lik in WASM Go README)
    - pub-sub in nats?

## Usage with lerna

```bash
lerna bootstrap
lerna run dev --parallel

lerna run test

# example new package
lerna create --private render-js
# adjust names and  entrypoint:dist/index.js
cd packages/render-js && npm i -D microbundle standard jest
```

Add `package.json` targets:

```json
"source": "lib/index.js",
"scripts": {
   ..
   "dev": "microbundle watch --jsx React.createElement"
 },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 0,
        "functions": 0,
        "lines": 0,
        "statements": 0
      }
    }
  },
  "standard": {
    "//parser": "babel-eslint",
    "env": {
      "jest": true
    }
  },
```

### Front end

```bash
cd packages
npx create-next-app
cd front-end
lerna add render-js
```

## History

I first wrote this code as part af my first undergrad internship at CRC.
My task was to implement these test patterns as part of a video signal processing research group. The original implementation was written in Fortran on a DEC LSI-11 (64kB of memory).

This was my first introduction to conics. The patterns generalize to conic sections or projections:

![Conic Sections](conic-eqn.gif)

When I joined the group,..

Thanks to André, Bernard, Gilles, Phil, Tom, Mike, Jean-Pierre, Metin.
