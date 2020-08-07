/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

import { Context } from './Drawer';

const DrawerListItem = (props) => {
  const {
    to, icon, children,
  } = props;

  const onClick = useContext(Context);

  return (
    <ListItem button component={Link} to={to} onClick={onClick} key={children}>
      {icon && (
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      )}
      <ListItemText primary={children} />
    </ListItem>
  );
};

DrawerListItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.string.isRequired,
};

DrawerListItem.defaultProps = {
  icon: null,
};

export default DrawerListItem;
