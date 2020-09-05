# Go WASM Experiments

This was modified from `hexy` example in
[Go WASM Experiments](https://github.com/stdiopt/gowasm-experiments)

## TODO

- Align external signatures
- Integrate into webpack loader

## Performance

optimizations:

- cache `ctx.getImageData.data`
- function inlining
- Sine/Cosine Lookup

Rendering times (`ms` at `400px/400px`):

|               | Chrome | Firefox  |
|--------------------|---|---|
| No Opt             | 28.5 | 15.7 |
| cache getImageData | 27.5 | 15.6 |
| function inlining  | 21.7 | 12.4 |
| Cos lookup         | 11.3 |  9.3  |

## Usage

```bash
./build.sh
npx serve -p 6543
open http://localhost:6543/
```

## References

- [Go WASM Experiments](https://github.com/stdiopt/gowasm-experiments)