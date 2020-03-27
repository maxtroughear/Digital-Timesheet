const userAuth = require('./user');

const serviceAuth = require('./serviceAdmin');

const { authenticateUser, authenticateServiceAdmin } = require('./context');

const { generateQR } = require('./common');

module.exports = {
  auth: {
    generateQR,
  },
  userAuth,
  serviceAuth,
  getUser: authenticateUser,
  getServiceAdmin: authenticateServiceAdmin,
};
