const HTTP = require('http');

const makeResponse = (statusCode) => (data) => ({
  status: statusCode,
  data,
});

const makeErrorResponse = (statusCode) => (message) => ({
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

module.exports.ok = makeResponse(200);
module.exports.okCreated = makeResponse(201);
module.exports.okNotContent = exports.ok('');

module.exports.notFound = makeErrorResponse(404);
module.exports.badRequest = makeErrorResponse(400);
module.exports.badRequestWithValidation = withValidation(exports.badRequest);
