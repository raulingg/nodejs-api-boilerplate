module.exports = {
  extends: ['airbnb-base', 'prettier'],
  env: {
    node: true,
    'jest/globals': true,
  },
  rules: {
    'global-require': 0,
  },
};
