module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['jest'],
  env: {
    node: true,
    'jest/globals': true,
  },
  rules: {
    'global-require': 0,
  },
};
