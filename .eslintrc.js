module.exports = {
  extends: [
    "airbnb-base",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "global-require": 0,
    "no-underscore-dangle": 0,
    "no-return-await": 0,
  },
};
