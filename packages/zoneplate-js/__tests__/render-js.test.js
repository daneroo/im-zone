'use strict'

//  should be import + babelrc?
const { renderJs } = require('..')

describe('render-js', () => {
  test('import renderJS ', () => {
    expect(typeof renderJs).toBe('function')
  })
  test('should add two numbers', () => {
    expect(renderJs(1, 2)).toBe(true)
  })
})
