const HTTP = require('http');

const makeResponse = (statusCode) => (message) => ({
  status: statusCode,
  data: {
    error: HTTP.STATUS_CODES[statusCode],
    message,
    statusCode,
  },
});

const withValidation =
  (fn) =>
  ({ source, keys, message }) => {
    const { status, data: partialData } = fn('Validation failed');
    return {
      status,
      data: {
        ...partialData,
        validation: { [source]: { keys, message, source } },
      },
    };
  };

module.exports.notFound = makeResponse(404);
module.exports.badRequest = makeResponse(400);
module.exports.badRequestWithValidation = withValidation(exports.badRequest);
