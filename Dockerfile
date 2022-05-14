# Run-time stage
FROM node:18.1.0-alpine as prod

# Set non-root user and expose port 8080
USER node
EXPOSE 8080

WORKDIR /home/node/app

# Copy dependency information and install production-only dependencies
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --only=production

# Copy results from previous stage
COPY --chown=node:node --from=build /home/node/app/dist ./dist

CMD [ "node", "app.js" ]

# Dev stage
FROM node:18.1.0 as dev

USER node
EXPOSE 8080

WORKDIR /home/node/app

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node --from=build /home/node/app/dist ./dist

CMD [ "node", "app.js" ]