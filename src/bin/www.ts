#!/usr/bin/env node
/* eslint-disable no-console */
import { createServer } from 'http';
import mongoose from 'mongoose';
import { createTerminus } from '@godaddy/terminus';
import app from '../app';
import config from '../config';
import { handleError, isOperationalError } from '../errorHandler';

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
