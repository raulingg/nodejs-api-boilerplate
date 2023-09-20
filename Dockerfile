# Dev stage
FROM node:18.16.0 as builder

USER node
EXPOSE 8080

WORKDIR /app

COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY /src ./src
# ✅ Safe install
RUN npm ci
RUN npm run build
COPY . .

# Run-time stage
FROM node:18.16.0-alpine as app

# Set non-root user and expose port 8080
USER node
EXPOSE 8080

WORKDIR /app

COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./

ENV NODE_ENV=production

CMD [ "node", "bin/www" ]
