const { shield } = require('graphql-shield');
const rules = require('./rules');

module.exports = shield({
  Query: {
    twoFactorQR: rules.isAuthenticated,
    user: rules.isAuthenticated,
    serviceAdmin: rules.isServiceAdmin,
  },
  Mutation: {
    enableTwoFactor: rules.isAuthenticated,
    disableTwoFactor: rules.isAuthenticated,
  },
},
{
  allowExternalErrors: true,
  debug: global.gDebug,
});
