# Zone plate generation

- [Deployed as a next.js (w/Rust/WASM)](https://zone.v.imetrical.com/)

- next.js - WASM - Rust: `./nextjs-wasm-rust/`
- static image/video generation in Go: `./static-go/`
- Original `C++` code from CRC in `./legacy-CRC/` *circa 1996*


| VT Zone Plate | VH Zone Plate |
|:-:|:-:|
| <img src="./vt-zone.gif" alt="VT zone plate" width="200" height="200">|<img src="./vh-zone.gif" alt="VH zone plate" width="200" height="200">|

## TODO

- Animate VH Zone Plate
- Allocate mem in Rust (@gcouprie): <https://www.hellorust.com/demos/canvas/index.html>
- Styling & Control (size/params)
- Exploit symmetry in zone plates
- History (with scans and pictures)

## History

I first wrote this code as part af my first undergrad internship at CRC.
My task was to implement these test patterns as part of a video signal processing research group. The original implementation was written in Fortran on a DEC LSI-11 (64kB of memory).

This was my first introduction to conics. The patterns generalize to conic sections or projections:

![Conic Sections](conic-eqn.gif)

When I joined the group,..

Thanks to André, Bernard, Gilles, Phil, Tom, Mike, Jean-Pierre, Metin.