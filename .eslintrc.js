module.exports = {
  extends: ['airbnb-base', 'plugin:jest/recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
    es2021: true,
  },
  rules: {
    'global-require': 0,
    'no-underscore-dangle': 0,
  },
};
