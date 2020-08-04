/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { Fade } from '@material-ui/core';

const ClientsDashboard = () => {
  const title = 'Clients';
  return (
    <Fade in>
      <h1>{title}</h1>
    </Fade>
  );
};

export default ClientsDashboard;
