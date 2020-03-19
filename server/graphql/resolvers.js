module.exports = {
  Query: {
    login: async (_, { code, username, password }, { auth }) => auth.login(
      code,
      username,
      password,
    ),
  },
  Mutation: {
    createUser: async (_, { code, username, password }, { auth }) => auth.createUser(
      code,
      username,
      password,
    ),
    createCompany: async (_, { name, code }, { models }) => {
      const company = new models.Company({
        name,
        code,
      });
      try {
        const result = await company.save();
        return result;
      } catch (err) {
        throw new Error('Company already exists');
      }
    },
  },
};
