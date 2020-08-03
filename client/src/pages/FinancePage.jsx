/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { Fade } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import NotFoundPage from './NotFound';

const FinanceDashboard = () => {
  const title = 'Finances';
  return (
    <Fade in>
      <h1>{title}</h1>
    </Fade>
  );
};

const ClientsDashboard = () => {
  const title = 'Clients';
  return (
    <Fade in>
      <h1>{title}</h1>
    </Fade>
  );
};

const FinancePage = () => (
  <Switch>
    <Route path="/finance" exact component={FinanceDashboard} />
    <Route path="/finance/clients" component={ClientsDashboard} />
    <Route path="*" component={NotFoundPage} />
  </Switch>
);

export default FinancePage;
