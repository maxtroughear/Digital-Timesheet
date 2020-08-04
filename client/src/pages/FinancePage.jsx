/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundPage from './NotFound';

const FinanceDashboard = lazy(() => import('./finance/Dashboard'));
const ClientsDashboard = lazy(() => import('./finance/Clients'));

const FinancePage = () => (
  <Switch>
    <Route path="/finance" exact component={FinanceDashboard} />
    <Route path="/finance/clients" component={ClientsDashboard} />
    <Route path="*" component={NotFoundPage} />
  </Switch>
);

export default FinancePage;
