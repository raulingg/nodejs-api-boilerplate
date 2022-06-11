module.exports = {
  extends: ["airbnb-base", "plugin:jest/recommended", "prettier"],
  plugins: ["prettier"],
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
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
  },
};
