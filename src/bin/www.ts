#!/usr/bin/env node
import mongoose from 'mongoose';
import { createServer } from 'http';
import { createTerminus } from '@godaddy/terminus';
import app from '../app.js';
import config from '../config/index.js';
import { handleError } from '../errorHandler.js';

const {
  app: { port, host },
  db,
} = config;

process.on('unhandledRejection', (err) => {
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw err;
});

process.on('uncaughtException', handleError);

/**
 * ODM initialization.
 */
mongoose.set('strictQuery', false);
await mongoose.connect(db.uri, db.options);
mongoose.connection.on('error', console.error);

const server = createServer(app);

/**
 * Health checks and graceful shutdown initialization.
 */
createTerminus(server, {
  signals: ['SIGTERM', 'SIGINT'],
  onSignal,
}).listen(port);

console.log(`server running at http://${host}:${port}`);

async function onSignal() {
  try {
    console.log('server is starting cleanup');
    await mongoose.connection.close();
    console.log('MongoDB connection has been closed');
  } catch (error) {
    console.error('error during MongoDB connection close', (error as Error).stack);
  }
}
