const { default: axios } = require('axios');

module.exports = (config = {}) =>
  axios.create({
    ...config,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
  });
