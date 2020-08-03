/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import Proptypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Fade } from '@material-ui/core';

const NotFoundPage = () => (
  <Fade in>
    <div
      css={{
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        Sorry nothing to see here
        {' '}
        <span role="img" aria-label="">⛔</span>
        {' '}
        <Link component={RouterLink} to="/">
          Go home
          <span role="img" aria-label="">🏡</span>
        </Link>
      </div>
    </div>
  </Fade>
);

NotFoundPage.propTypes = {
  location: Proptypes.shape({
    pathname: Proptypes.string.isRequired,
  }).isRequired,
};

export default NotFoundPage;
