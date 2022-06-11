module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello world - Images API');
  });

  app.use('/images', require('./components/images/handlers'));
};
