/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { List } from '@material-ui/core';

const DrawerList = (props) => {
  const { children } = props;

  return (
    <List>{children}</List>
  );
};

DrawerList.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DrawerList;
