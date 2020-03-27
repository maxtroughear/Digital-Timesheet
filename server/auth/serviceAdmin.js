const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');

const { ServiceAdmin } = require('../mongo').models;

const login = async (username, password, twoFactor) => {
  const serviceAdmin = await ServiceAdmin
    .findOne({ username });

  if (!serviceAdmin) return new Error('Password incorrect');

  const isEqual = await bcrypt.compare(password, serviceAdmin.password);
  if (!isEqual) return new Error('Password incorrect');

  if (serviceAdmin.twoFactor.enabled && !twoFactor) {
    return {
      twoFactorEnabled: true,
    };
  } if (serviceAdmin.twoFactor.enabled) {
    if (!authenticator.check(twoFactor, serviceAdmin.twoFactor.secret)) {
      return new Error('2FA token invalid');
    }
  }

  const serviceAdminData = {
    id: serviceAdmin.id,
    username: serviceAdmin.username,
  };
  const opts = {
    expiresIn: '1h',
  };
  const token = jwt.sign(serviceAdminData, global.gTokenSecret, opts);

  return {
    serviceAdmin,
    token,
    tokenExpiration: 1,
    twoFactorEnabled: serviceAdmin.twoFactor.enabled,
  };
};

const create = async (username, password) => {
  const existingServiceAdmin = await ServiceAdmin.findOne({ username });
  if (existingServiceAdmin) return new Error('ServiceAdmin already exists');

  const hashedPassword = await bcrypt.hash(password, 12);

  const serviceAdmin = new ServiceAdmin({
    username,
    password: hashedPassword,
  });

  const result = await serviceAdmin.save();
  return result;
};

const enableTwoFactor = async (serviceAdminModel, token, secret) => {
  const serviceAdmin = serviceAdminModel;

  if (serviceAdmin.twoFactor.enabled) return new Error('2FA already enabled');

  if (!authenticator.check(token, secret)) return new Error('2FA token invalid');

  serviceAdmin.twoFactor = {
    enabled: true,
    secret,
  };

  const result = await serviceAdmin.save();
  return result === serviceAdmin;
};

const disableTwoFactor = async (serviceAdminModel, password) => {
  const serviceAdmin = serviceAdminModel;

  if (!serviceAdmin.twoFactor.enabled) return new Error('2FA not enabled');

  const isEqual = await bcrypt.compare(password, serviceAdmin.password);
  if (!isEqual) return new Error('Password incorrect');

  serviceAdmin.twoFactor = {
    enabled: false,
  };

  const result = await serviceAdmin.save();
  return result === serviceAdmin;
};

module.exports = {
  login,
  create,
  enableTwoFactor,
  disableTwoFactor,
};
