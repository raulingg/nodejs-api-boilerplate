import axios from 'axios';

export default (config = {}) =>
  axios.default.create({
    ...config,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
  });
