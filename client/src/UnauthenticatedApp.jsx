/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { useState, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green, red } from '@material-ui/core/colors';
import {
  Button, Paper, TextField, Typography, CircularProgress, Collapse, Fade,
} from '@material-ui/core';
import { useMutation } from '@apollo/client';

import SnackbarAlert from 'components/SnackbarAlert';

import { LOGIN, IS_LOGGED_IN } from 'graphql/Queries';
import localStorageKey from 'utils/LocalStorageKey';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    '& > *': {
      margin: theme.spacing(2),
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonWarning: {
    backgroundColor: amber[500],
    '&:hover': {
      backgroundColor: amber[700],
    },
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}));

const getSubdomain = () => {
  const baseDomain = process.env.REACT_APP_BASE_DOMAIN;
  const baseDomainParts = baseDomain.split('.');
  const { host } = window.location;
  const hostParts = host.split('.');
  if (hostParts.length > baseDomainParts.length) {
    // has subdomain
    return hostParts[0];
  }
  return '';
};

const UnauthenticatedApp = (props) => {
  // const client = useApolloClient();
  const classes = useStyles();

  const { onLogin } = props;

  const [incorrectOpen, setIncorrectOpen] = useState(false);
  const [twoFactorEnabledOpen, setTwoFactorEnabledOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [company, setCompany] = useState(getSubdomain());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [loginMutation, {
    data, loading, client,
  }] = useMutation(LOGIN, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
    onCompleted: useCallback(({ login }) => {
      if (login.twoFactorEnabled && !login.token) {
        setTwoFactorEnabledOpen(true);
        setTwoFactorEnabled(true);
      } else {
        setSuccess(true);
        localStorage.setItem(localStorageKey, login.token);
        onLogin();
      }
    }, [onLogin]),
    onError: useCallback((e) => {
      setErrorMessage(e.message.replace('GraphQL error: ', ''));
      setIncorrectOpen(true);
    }, []),
  });

  const handleLoginExited = () => {
    client.writeQuery({
      query: IS_LOGGED_IN,
      data: { isLoggedIn: true },
    });
  };

  const handleIncorrectClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIncorrectOpen(false);
  };

  const handleTwoFactorEnabledClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setTwoFactorEnabledOpen(false);
  };

  const buttonClassname = clsx({
    [classes.buttonSuccess]: data && data.userLogin && data.userLogin.token,
    [classes.buttonWarning]: twoFactorEnabledOpen,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!loading && !success) {
      loginMutation({
        variables: {
          company,
          username,
          password,
          twoFactor,
        },
      });
    }
  };

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Fade in={!success} onExited={handleLoginExited}>
        <Paper className={classes.root} elevation={5}>
          <Typography variant="h4" gutterBottom>
            Timesheet Login
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              required
              label="Company"
              helperText="Your company's code"
              variant="filled"
              disabled={loading || success || getSubdomain() !== ''}
              value={company.toUpperCase()}
              onChange={(e) => setCompany(e.target.value.toLowerCase())}
            />
            <TextField
              required
              label="Username"
              variant="filled"
              disabled={loading || success}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              required
              label="Password"
              type="password"
              variant="filled"
              disabled={loading || success}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Collapse in={twoFactorEnabled}>
              <TextField
                label="2FA code"
                variant="filled"
                required={twoFactorEnabled}
                disabled={!twoFactorEnabled || loading || success}
                onChange={(e) => setTwoFactor(e.target.value)}
              />
            </Collapse>
            <div className={classes.buttonWrapper}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading || success}
                className={buttonClassname}
              >
                Login
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </form>
        </Paper>
      </Fade>
      <SnackbarAlert open={incorrectOpen} onClose={handleIncorrectClose} severity="error" message={errorMessage} />
      <SnackbarAlert open={twoFactorEnabledOpen} onClose={handleTwoFactorEnabledClose} severity="warning" message="Two Factor Authentication is Enabled" />
    </div>
  );
};

UnauthenticatedApp.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default UnauthenticatedApp;
