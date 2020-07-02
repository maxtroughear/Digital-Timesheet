module.exports = {
  createUser: async (_, {
    code, username, password,
  }, { userAuth }) => userAuth.create(
    code, username, password,
  ),
  createCompany: async (_, {
    name, code,
  }, { models }) => {
    try {
      return await models.Company({
        name, code,
      }).save();
    } catch (err) {
      throw new Error('Company already exists');
    }
  },
  enableTwoFactor: async (_, {
    token, secret,
  }, {
      userAuth, serviceAuth, user, serviceAdmin,
    }) => {
    if (user) return userAuth.enableTwoFactor(user, token, secret);
    return serviceAuth.enableTwoFactor(serviceAdmin, token, secret);
  },
  disableTwoFactor: async (_, {
    password,
  }, {
      userAuth, serviceAuth, user, serviceAdmin,
    }) => {
    if (user) return userAuth.disableTwoFactor(user, password);
    return serviceAuth.disableTwoFactor(serviceAdmin, password);
  },
};
