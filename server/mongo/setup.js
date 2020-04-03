const bcrypt = require('bcrypt');
const { Company, User, ServiceAdmin } = require('./models');

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

const addInitialUserAndCompany = async () => {
  let company = await Company.findOne({ code: '1' });
  if (!company) {
    company = new Company({
      name: 'Company One',
      code: '1',
    });
  }

  let user = await User.findOne({ company });
  if (!user) {
    user = new User({
      company,
      username: 'user',
      password: bcrypt.hashSync('pass', 12),
    });
  }
};

module.exports = {
  setupIndexes,
  addInitialServiceAdmin,
  addInitialUserAndCompany,
};
