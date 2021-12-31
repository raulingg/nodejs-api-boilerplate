module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello world - Products API' });
  });

  app.use('/products', require('./components/products/routes'));
};
