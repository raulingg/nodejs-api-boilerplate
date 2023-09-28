export default {
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nodejs-api-boilerplate-test',
    options: {
      serverSelectionTimeoutMS: 5000,
    },
  },
};
