import { base64 } from 'rollup-plugin-base64'

export default {
  input: 'lib/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    base64({ include: '**/*.wasm' })
  ]
}
