const mongoose = require('mongoose');

const logger = require('../logger');

const User = require('./models/user');
const Company = require('./models/company');
const ServiceAdmin = require('./models/serviceAdmin');

const { setupIndexes, addInitialServiceAdmin } = require('./setup');

const connect = ({ uri, options }) => mongoose.connect(uri, options);

Company.on('index', (err) => {
  logger.info('Company index built');
  if (err) logger.error(err);
});

ServiceAdmin.on('index', (err) => {
  logger.info('ServiceAdmin index built');
  if (err) logger.error(err);
});

mongoose.connection.on('connected', () => {
  setupIndexes();
  addInitialServiceAdmin();
});

const models = {
  User,
  Company,
  ServiceAdmin,
};

module.exports = {
  connect,
  models,
};
