/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';

const DashboardPage = () => {
  const title = 'Dashboard';

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
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default DashboardPage;
