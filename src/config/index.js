const inDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'production',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
  },
  db: {
    connectionString: process.env.MONGO_URI,
    connectionOptions: {},
  },
  cors: {
    origin: inDevelopment
      ? true
      : (process.env.CORS_ORIGINS || '').split(',') || false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: false,
  },
  logger: {
    enabled: process.env.LOG_ENABLED ?? true,
    dest: process.env.LOG_DEST || './logs/error.log',
  },
};
