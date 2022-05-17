// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['warn', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    // 'object-curly-spacing': ['error', 'always'],
    // 'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
  },
}