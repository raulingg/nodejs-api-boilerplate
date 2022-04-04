# Products JSON API

[🔗 Link to Demo in Heroku](https://murmuring-mesa-59619.herokuapp.com/)

## Data model

![master-detail-product-datamodel](https://user-images.githubusercontent.com/9435850/147842410-d82a26d0-cf5f-4cb5-8c23-9893bc3a6447.png)

Take a look at [prisma/schema.prisma](prisma/schema.prisma)

## HTTP verbs

### POST /products

- **Request example**

    ```json
    {
        "sku": "122737445",
        "title": "new product",
        "description": "any description",
        "price": 12.11,
        "quantity" : 1, // optional
        "image": "https://picsum.photos/id/237/200/300", //optional
        "categoryId": 1, // optional
        "available": true // optional
    }
    ```

- **Response example**

  - status code: `201`
  - body

    ```json
    {
        "sku": "122737445",
        "title": "new product",
        "description": "any description",
        "price": 12.11,
        "image": "https://picsum.photos/id/237/200/300", //opcional
        "available": true
    }
    ```

### PUT /products/:id

- **Request example**

    ```json
    {
        "sku": "122737445",
        "title": "new product",
        "description": "any description",
        "price": 12.11,
        "quantity" : 1,
        "image": "https://picsum.photos/id/237/200/300",
        "categoryId": 1,
        "available": false
    }
    ```

- **Response example**

  - status code: `204`

## Implementation requirements

1. Follow the REST architectural style 🆗
    - Node.js 14.18.0 🆗
    - any framework: express, fastify, etc. It’s a plus to use Nest.js 🆗
2. Follow SOLID patterns. ❗
3. Follow TDD (Unit tests and 1 integration test) ❗
4. Use good patterns to validate requests and responses 🆗
5. Use other good code practices or programming principles. Clean code. 🆗
6. Follow good practices to build REST APIs ❗
7. Configure CORS 🆗
8. Use typescript 🤦🏽‍♂️

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

__Why don't store the response time in a file?__

Log destinations should not be hard-coded by developers within the application code, but instead should be defined by the execution environment the application runs in. Developers should write logs to stdout using a logger utility and then let the execution environment (container, server, etc.) pipe the stdout stream to the appropriate destination (i.e. Splunk, Graylog, ElasticSearch, etc.).

[🔗 Read More: Log Routing](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/logrouting.md)

## Good Practices

This repo somewhat follows the best practices from [nodebestpractices repo](https://github.com/goldbergyoni/nodebestpractices) in Github.

## CORS configuration

CORS will be available when `NODE_ENV` envar is set to `production`.
To specify which origins will be allowed to make requests, set the `CORS_ORIGINS` envar,
otherwise no origin will be allowed.

- To allow any origin `CORS_ORIGINS=*`
- To allow specific origins `CORS_ORIGINS=mydomain.com,other-domain.com`
