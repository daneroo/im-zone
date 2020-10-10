module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  plugins: ['react', 'jsx-a11y', 'import'],
  ignorePatterns: ['slides/'],
  rules: {
    // Next imports React into pages automatically
    'react/react-in-jsx-scope': 'off',
    // Next includes packages like MDX using their bundle
    'import/no-extraneous-dependencies': 'off',
    // Not yet...
    'react/prop-types': 'off',
    // too convenient!
    'react/jsx-props-no-spreading': 'off',

    // Turn off const conversion
    // .. actually keep it (from upstream)
    // 'prefer-const': 'off',
  },
  env: {
    browser: true,
  },
}
