#!/usr/bin/env node
import { createServer } from 'http';
import mongoose from 'mongoose';
import { createTerminus } from '@godaddy/terminus';
import app from '../app.js';
import config from '../config/index.js';
import { handleError, isOperationalError } from '../errorHandler.js';

const {
  app: { port, host },
  db,
} = config;

process.on('unhandledRejection', (err) => {
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw err;
});

process.on('uncaughtException', (err) => {
  const operational = isOperationalError(err);
  handleError(err);

  if (!operational) process.emit('SIGTERM');
});

/**
 * ODM initialization.
 */
mongoose.set('strictQuery', false);
await mongoose.connect(db.connectionString, db.connectionOptions);
const server = createServer(app);
createTerminus(server, { signals: ['SIGTERM', 'SIGINT'] });

server.listen(port);
console.log(`server running at http://${host}:${port}`);

mongoose.connection.on('error', console.error);
