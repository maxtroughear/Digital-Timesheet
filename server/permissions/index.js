const { shield } = require('graphql-shield');
const rules = require('./rules');

module.exports = shield({
  Query: {
    twoFactorQR: rules.isAuthenticated,
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
