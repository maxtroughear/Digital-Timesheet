/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { Button } from '@material-ui/core';
import { useApolloClient } from '@apollo/client';

const DashboardPage = () => {
  const client = useApolloClient();

  const handleLogout = () => {
    localStorage.clear();
    client.resetStore();
  };
  return (
    <div
      css={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        <h1>Dashboard</h1>
        <Button
          variant="contained"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
