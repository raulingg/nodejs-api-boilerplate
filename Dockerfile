# Dev stage
FROM node:18.1.0 as build

USER node
EXPOSE 8080

WORKDIR /app

COPY package.json package-lock.json ./
# ✅ Safe install
RUN npm ci
COPY . .

CMD [ "node", "app.js" ]

# Run-time stage
FROM node:18.1.0-alpine as app

# Set non-root user and expose port 8080
USER node
EXPOSE 8080

WORKDIR /app

COPY --chown=node:node --from=build /app/package.json /app/package-lock.json ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/src ./src

# ✅ Clean dev packages
RUN npm prune --production

CMD [ "node", "app.js" ]
