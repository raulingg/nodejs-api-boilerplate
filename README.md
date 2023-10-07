# Products JSON API

## Good Practices

This repo somewhat follows the best practices from [nodebestpractices repo](https://github.com/goldbergyoni/nodebestpractices) & [nodejs-integration-tests-best-practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices) in Github.

## Logging

### Levels

- **Fatal** — `fatal`:  Used for reporting about errors that are forcing shutdown of the application.
- **Error** — `error`: Used for logging serious problems occurred during execution of the program.
- **Warning** — `warn`: Used for reporting non-critical unusual behavior.
- **Info** — `info`: Used for informative messages highlighting the progress of the application for sysadmins and end users.
- **Debug** — `debug`: Used for debugging messages with extended information about application processing.
- **HTTP** — `http`: Used for logging HTTP requests.

### Logging response time

The current logger ([Pino](https://github.com/pinojs/pino)) logs by default the
response time of every request with the key `responseTime`.

_Note_ The `responseTime` value will be in milliseconds (ms).

__Why don't store logs in a file?__

Log destinations should not be hard-coded by developers within the application code, but instead should be defined by the execution environment the application runs in. Developers should write logs to stdout using a logger utility and then let the execution environment (container, server, etc.) pipe the stdout stream to the appropriate destination (i.e. Splunk, Graylog, ElasticSearch, etc.).

[🔗 Read More: Log Routing](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/logrouting.md)


## CORS configuration

CORS will be available when `NODE_ENV` envar is set to `production`.
To specify which origins will be allowed to make requests, set the `CORS_ORIGINS` envar,
otherwise no origin will be allowed.

- To allow any origin `CORS_ORIGINS=*`
- To allow specific origins `CORS_ORIGINS=mydomain.com,other-domain.com`
