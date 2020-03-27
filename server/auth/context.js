const jwt = require('jsonwebtoken');

const { User, ServiceAdmin } = require('../mongo').models;

const getUserFromToken = async (token) => {
  if (!token || token === '') return null;
  let decoded;
  try {
    decoded = jwt.verify(token, global.gTokenSecret);
  } catch (err) {
    return null;
  }
  const user = await User.findById(decoded.id);

  if (!user) return null;

  if (user.username === decoded.username) { return user; }
  return null;
};

const authenticateUser = async (req) => {
  const token = req.request.headers.authorization || '';
  return getUserFromToken(token.split(' ')[1]);
};

const getServiceAdminFromToken = async (token) => {
  if (!token || token === '') return null;
  let decoded;
  try {
    decoded = jwt.verify(token, global.gTokenSecret);
  } catch (err) {
    return null;
  }
  const serviceAdmin = await ServiceAdmin.findById(decoded.id);

  if (!serviceAdmin) return null;

  if (serviceAdmin.username === decoded.username) { return serviceAdmin; }
  return null;
};

const authenticateServiceAdmin = async (req) => {
  const token = req.request.headers.authorization || '';
  return getServiceAdminFromToken(token.split(' ')[1]);
};

module.exports = {
  authenticateUser,
  authenticateServiceAdmin,
};
