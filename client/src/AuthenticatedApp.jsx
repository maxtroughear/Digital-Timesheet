/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import React from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';
import Proptypes from 'prop-types';
import ErrorBoundary from 'react-error-boundary';
import { Fade } from '@material-ui/core';

import * as colours from 'styles/colours';

import AppNavigation from 'components/AppNavigation';

import DashboardPage from 'pages/DashboardPage';
import NotFoundPage from 'pages/NotFound';

const ErrorFallback = ({ error }) => (
  <div role="alert" css={{ color: colours.danger, fontSize: '0.7em' }}>
    <span>There was an error:</span>
    {' '}
    <pre
      css={{
        display: 'inline-block',
        overflow: 'scroll',
        margin: '0',
        marginBottom: -5,
      }}
    >
      {error.message}
    </pre>
  </div>
);

ErrorFallback.propTypes = {
  error: Proptypes.shape({
    message: Proptypes.string,
  }),
};

ErrorFallback.defaultProps = {
  error: {
    message: '',
  },
};

const AuthenticatedApp = () => (
  <BrowserRouter>
    <Fade in>
      <React.Fragment>
        <AppNavigation>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Switch>
              <Redirect from="/" to="/dashboard" exact />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </ErrorBoundary>
        </AppNavigation>
      </React.Fragment>
    </Fade>
  </BrowserRouter>
);

export default AuthenticatedApp;
