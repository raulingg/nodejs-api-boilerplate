module.exports = {
  extends: ['airbnb-base', 'plugin:jest/recommended', 'plugin:prettier/recommended'],
  plugins: ['jest'],
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  rules: {
    'global-require': 0,
    'no-underscore-dangle': 0,
  },
};
