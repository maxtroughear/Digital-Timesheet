import {
  ApolloClient, ApolloLink, HttpLink, InMemoryCache, from,
} from '@apollo/client';
import gql from 'graphql-tag';

import { resolvers, typeDefs } from './ApolloResolvers';
import localStorageKey from './LocalStorageKey';

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const token = localStorage.getItem(localStorageKey);
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
        'client-name': 'Timesheet [web]',
        'client-version': '0.0.1',
      },
    };
  });
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: '/api/',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    authMiddleware,
    httpLink,
  ]),
  resolvers,
  typeDefs,
});

const writeInitialData = () => {
  client.writeQuery({
    query: gql`
      {
        isLoggedIn @client
      }
    `,
    data: {
      isLoggedIn: !!localStorage.getItem(localStorageKey),
    },
  });
};

writeInitialData();

client.onResetStore(writeInitialData);
client.onClearStore(writeInitialData);

export default client;
