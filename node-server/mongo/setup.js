const bcrypt = require('bcrypt');
const ServiceAdmin = require('./models/serviceAdmin');

const logger = require('../logger');

const setupIndexes = async () => {

};

const addInitialServiceAdmin = async () => {
  if (!(await ServiceAdmin.exists({}))) {
    const sa = new ServiceAdmin({
      username: 'admin',
      password: bcrypt.hashSync('serviceadmin', 12),
    });

    if (global.gAppInstance === '0') {
      logger.info('Creating Default ServiceAdmin account');
      sa.save().catch((err) => {
        logger.error(err);
      });
    }
  }
};

module.exports = {
  setupIndexes,
  addInitialServiceAdmin,
};
