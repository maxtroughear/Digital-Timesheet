/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import Proptypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';

const NotFoundPage = ({ location }) => (
  <div
    css={{
      height: '100%',
      display: 'grid',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div>
      Sorry... nothing here at
      {' '}
      <code>{location.pathname}</code>
      {' '}
      <Link component={RouterLink} to="/">
        Go home
        <span role="img" aria-label="">🏡</span>
      </Link>
    </div>
  </div>
);

NotFoundPage.propTypes = {
  location: Proptypes.shape({
    pathname: Proptypes.string.isRequired,
  }).isRequired,
};

export default NotFoundPage;
