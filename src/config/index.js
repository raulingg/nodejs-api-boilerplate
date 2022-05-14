const inDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
  },
  db: {
    connectionString: process.env.DB_URL,
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
  },
  cors: {
    origin: inDevelopment ? true : (process.env.CORS_ORIGINS || '').split(',') || false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: false,
  },
  logger: {
    enabled: process.env.NODE_ENV !== 'test',
  },
};
