import {
  ApolloClient, ApolloLink, HttpLink, InMemoryCache, from,
} from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/link-persisted-queries';

import { IS_LOGGED_IN } from 'graphql/Queries';
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
  uri: process.env.REACT_APP_API_URI,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    createPersistedQueryLink({
      // generateHash: ({ documentId }) => documentId,
      useGETForHashedQueries: false,
    }),
    authMiddleware,
    httpLink,
  ]),
  resolvers,
  typeDefs,
});

const writeInitialData = () => {
  client.writeQuery({
    query: IS_LOGGED_IN,
    data: {
      isLoggedIn: !!localStorage.getItem(localStorageKey),
    },
  });
};

writeInitialData();

client.onResetStore(writeInitialData);
client.onClearStore(writeInitialData);

export default client;
