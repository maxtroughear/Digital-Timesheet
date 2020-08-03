/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { Fade } from '@material-ui/core';

const DashboardPage = () => {
  const title = 'Dashboard';

  return (
    <Fade in>
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
    </Fade>
  );
};

export default DashboardPage;
