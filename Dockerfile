# Dev stage
FROM node:18.1.0 as builder

USER node
EXPOSE 8080

WORKDIR /app

COPY package.json package-lock.json ./
# ✅ Safe install
RUN npm ci
COPY . .

# Run-time stage
FROM node:18.1.0-alpine as app

# Set non-root user and expose port 8080
USER node
EXPOSE 8080

WORKDIR /app

COPY --chown=node:node --from=builder /app/package.json /app/package-lock.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/src ./src

ENV NODE_ENV=production

CMD [ "node", "src/www/bin" ]
