module.exports = {
  userLogin: async (_, {
    code, username, password, twoFactor,
  }, { userAuth }) => userAuth.login(
    code, username, password, twoFactor,
  ),

  serviceAdminLogin: async (_, {
    username, password, twoFactor,
  }, { serviceAuth }) => serviceAuth.login(
    username, password, twoFactor,
  ),

  user: async (_, {
    id,
  }, { user, models }) => ((!id) ? user : models.User.findById(id).populate('company')),

  serviceAdmin: async (_, {
    id,
  }, { serviceAdmin, models }) => ((!id) ? serviceAdmin : models.ServiceAdmin.findById(id)),

  twoFactorQR: async (_, {
    secret,
  }, { auth, user, serviceAdmin }) => auth.generateQR(
    (user !== null) ? user.username : serviceAdmin.username,
    secret,
  ),
};
