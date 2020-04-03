/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import Proptypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';

const SnackbarAlert = ({
  open, onClose, severity, message,
}) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
    <MuiAlert elevation={6} variant="filled" onClose={onClose} severity={severity}>
      {message}
    </MuiAlert>
  </Snackbar>
);

SnackbarAlert.propTypes = {
  open: Proptypes.bool.isRequired,
  onClose: Proptypes.func.isRequired,
  severity: Proptypes.string.isRequired,
  message: Proptypes.string.isRequired,
};

export default SnackbarAlert;
