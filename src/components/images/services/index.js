const { Image } = require('../models');
const ImageServiceFactory = require('./ImageServiceFactory');

module.exports = {
  ImageService: ImageServiceFactory(Image),
};
