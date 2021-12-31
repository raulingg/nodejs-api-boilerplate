# Products API

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
response time of every request with the key `responseTime`. So, you don't have to worry doing it yourself!

_Note_ The `responseTime` value will be in milliseconds (ms).

__Why don't store the response time in a file?__

Log destinations should not be hard-coded by developers within the application code, but instead should be defined by the execution environment the application runs in. Developers should write logs to stdout using a logger utility and then let the execution environment (container, server, etc.) pipe the stdout stream to the appropriate destination (i.e. Splunk, Graylog, ElasticSearch, etc.).

[🔗 Read More: Log Routing](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/logrouting.md)
