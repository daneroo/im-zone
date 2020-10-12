'use strict'

//  should be import + babelrc?
const { Equation } = require('../lib')

describe('zoneplate', () => {
  test('import Equation ', () => {
    expect(typeof Equation).toBe('function')
  })
})
