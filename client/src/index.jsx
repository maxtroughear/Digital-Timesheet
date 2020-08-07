// polyfill internet explorer 11
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// polyfill fetch
import 'unfetch/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'typeface-roboto';

import client from 'utils/ApolloClient';
import theme from 'Theme';

import App from './App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
