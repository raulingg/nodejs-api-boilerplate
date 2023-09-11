import HTTP from 'http';

type ResponseOk = {
  status: StatusOk;
  data: Record<string, any> | string;
};

type ResponseError = {
  status: number;
  data: ApplicationError;
};

type ResponseBadRequest = {
  status: 400;
  data: ApplicationError & {
    validation: Record<string, ValidationError>;
  };
};

type ApplicationError = {
  error?: string;
  message: string;
  statusCode: number;
};

type ValidationError = {
  source: string;
  keys: string[];
  message: string;
};

type StatusOk = 200 | 201 | 202 | 203 | 204;

const makeResponse =
  (statusCode: StatusOk) =>
  (data: Record<string, any> | string): ResponseOk => ({
    status: statusCode,
    data,
  });

const makeErrorResponse =
  (statusCode: number) =>
  (message: string): ResponseError => ({
    status: statusCode,
    data: {
      error: HTTP.STATUS_CODES[statusCode],
      message,
      statusCode,
    },
  });

const withValidation =
  (fn: (message: string) => ResponseError) =>
  ({ source, keys, message }: ValidationError): ResponseBadRequest => {
    const { data: partialData } = fn('Validation failed');
    return {
      status: 400,
      data: {
        ...partialData,
        validation: { [source]: { keys, message, source } },
      },
    };
  };

export const ok = makeResponse(200);
export const okCreated = makeResponse(201);
export const okNotContent = makeResponse(204);

export const notFound = makeErrorResponse(404);
export const badRequest = makeErrorResponse(400);
export const badRequestWithValidation = withValidation(badRequest);
export const internalError = makeErrorResponse(500);
