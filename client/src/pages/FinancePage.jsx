/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { FullPanelSpinner } from 'components/lib';
import NotFoundPage from './NotFound';

const FinanceDashboard = lazy(() => import('./finance/Dashboard'));
const ClientsDashboard = lazy(() => import('./finance/Clients'));

const FinancePage = () => (
  <Suspense fallback={<FullPanelSpinner />}>
    <Switch>
      <Route path="/finance" exact component={FinanceDashboard} />
      <Route path="/finance/clients" component={ClientsDashboard} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  </Suspense>
);

export default FinancePage;
