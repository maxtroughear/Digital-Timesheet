/* eslint-disable no-param-reassign */
const {
  addWebpackModuleRule, override,
} = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.graphql$/,
    use: [
      {
        loader: 'graphql-persisted-document-loader',
        options: {
          addTypename: true,
        },
      }, // <= Before graphql-tag/loader!
      { loader: 'graphql-tag/loader' },
    ],
  }),
);
