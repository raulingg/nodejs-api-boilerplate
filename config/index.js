require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const inDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
  },
  cors: {
    origin: inDevelopment ? true : process.env.CORS_ORIGINS?.split(',') || false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: false,
  },
  db: {
    uri: process.env.DATABASE_URI || ':memory:',
  },
  logger: {
    enabled: process.env.NODE_ENV !== 'test',
  },
};
