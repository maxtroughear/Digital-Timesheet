/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import React from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import Proptypes from 'prop-types';
import ErrorBoundary from 'react-error-boundary';
import { Fade, Container } from '@material-ui/core';

import * as colours from 'styles/colours';

import AppNavigation from 'components/AppNavigation';

import NotFoundPage from 'pages/NotFound';
import { FullPanelSpinner } from 'components/lib';

const DashboardPage = React.lazy(() => import('pages/DashboardPage'));
const ProfilePage = React.lazy(() => import('pages/Profile'));
const FinancePage = React.lazy(() => import('pages/FinancePage'));

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

const AuthenticatedApp = (props) => {
  const { onLogout } = props;
  return (
    <BrowserRouter>
      <Fade in>
        <React.Fragment>
          <AppNavigation onLogout={onLogout}>
            <Container maxWidth="xl">
              <React.Suspense fallback={<FullPanelSpinner />}>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Switch>
                    <Route path="/" component={DashboardPage} exact />
                    <Route path="/profile" component={ProfilePage} />
                    <Route path="/finance" component={FinancePage} />
                    <Route path="*" component={NotFoundPage} />
                  </Switch>
                </ErrorBoundary>
              </React.Suspense>
            </Container>
          </AppNavigation>
        </React.Fragment>
      </Fade>
    </BrowserRouter>
  );
};

AuthenticatedApp.propTypes = {
  onLogout: Proptypes.func.isRequired,
};

export default AuthenticatedApp;
