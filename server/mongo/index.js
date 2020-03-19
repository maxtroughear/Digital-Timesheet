const mongoose = require('mongoose');
const User = require('./models/user');
const Event = require('./models/event');
const Company = require('./models/company');

mongoose.Promise = global.Promise;

const connect = ({ uri, options }) => mongoose.connect(uri, options);

const models = {
  User,
  Event,
  Company,
};

module.exports = {
  connect,
  models,
};
