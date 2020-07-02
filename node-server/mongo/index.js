const mongoose = require('mongoose');

const logger = require('../logger');

const models = require('./models');

const { setupIndexes, addInitialServiceAdmin } = require('./setup');

const connect = ({ uri, options }) => mongoose.connect(uri, options);

models.User.on('index', (err) => {
  logger.info('User index built');
  if (err) logger.error(err);
});

models.Company.on('index', (err) => {
  logger.info('Company index built');
  if (err) logger.error(err);
});

models.ServiceAdmin.on('index', (err) => {
  logger.info('ServiceAdmin index built');
  if (err) logger.error(err);
});

mongoose.connection.on('connected', () => {
  setupIndexes();
  addInitialServiceAdmin();
});

module.exports = {
  connect,
  models,
};
