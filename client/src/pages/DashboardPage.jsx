/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { Button } from '@material-ui/core';
import { useApolloClient } from '@apollo/client';

const DashboardPage = () => {
  const client = useApolloClient();

  return (
    <div
      css={{
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        <h1>Dashboard</h1>
      </div>
    </div>
  );
};

export default DashboardPage;
