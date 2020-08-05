/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { createContext } from 'react';
import PropTypes from 'prop-types';
import {
  Drawer, SwipeableDrawer, Hidden, useTheme, makeStyles,
} from '@material-ui/core';

const Context = createContext();

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

const FullDrawer = (props) => {
  const {
    children, onClick, onClose, onOpen, mobileOpen,
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="menu">
      <Hidden smUp implementation="js">
        <SwipeableDrawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onOpen={onOpen}
          onClose={onClose}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Context.Provider value={onClick}>
            {children}
          </Context.Provider>
        </SwipeableDrawer>
      </Hidden>
      <Hidden xsDown implementation="js">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <Context.Provider value={onClick}>
            {children}
          </Context.Provider>
        </Drawer>
      </Hidden>
    </nav>
  );
};

FullDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
};

FullDrawer.defaultProps = {
  onClick: () => {},
};

export { Context };

export default FullDrawer;
