const {
  rule,
} = require('graphql-shield');

const isAuthenticated = rule({ cache: 'contextual' })(
  async (_, args, { user, serviceAdmin }) => (user !== null || serviceAdmin !== null),
);

const isUser = rule({ cache: 'contextual' })(
  async (_, args, { user }) => user !== null,
);

const isServiceAdmin = rule({ cache: 'contextual' })(
  async (_, args, { serviceAdmin }) => serviceAdmin !== null,
);

module.exports = {
  isAuthenticated,
  isUser,
  isServiceAdmin,
};
