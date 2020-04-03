import gql from 'graphql-tag';

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

const resolvers = {

};

export {
  typeDefs,
  resolvers,
};
