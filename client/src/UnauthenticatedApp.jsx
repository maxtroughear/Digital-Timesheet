/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green, red } from '@material-ui/core/colors';
import {
  Button, Paper, TextField, Typography, CircularProgress, Collapse, Grow,
} from '@material-ui/core';
import { useApolloClient, useLazyQuery } from '@apollo/client';

import SnackbarAlert from 'components/SnackbarAlert';

import { LOGIN_USER, IS_LOGGED_IN } from 'graphql/Queries';
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

const UnauthenticatedApp = () => {
  const client = useApolloClient();
  const classes = useStyles();

  const [incorrectOpen, setIncorrectOpen] = useState(false);
  const [twoFactorEnabledOpen, setTwoFactorEnabledOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [company, setCompany] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [login, {
    data, loading,
  }] = useLazyQuery(LOGIN_USER, {
    fetchPolicy: 'network-only',
    errorPolicy: 'none',
    onCompleted({ userLogin }) {
      if (userLogin.twoFactorEnabled && !userLogin.token) {
        setTwoFactorEnabledOpen(true);
        setTwoFactorEnabled(true);
        return;
      }
      setSuccess(true);
      localStorage.setItem(localStorageKey, userLogin.token);
    },
    onError(e) {
      setErrorMessage(e.message.replace('GraphQL error: ', ''));
      setIncorrectOpen(true);
    },
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
      login({
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
      <Grow in={!success} onExited={handleLoginExited}>
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
              disabled={loading || success}
              onChange={(e) => setCompany(e.target.value)}
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
            <Typography>
              HINT: Login info
              <br />
              company: 1
              username: user
              password: pass
            </Typography>
          </form>
        </Paper>
      </Grow>
      <SnackbarAlert open={incorrectOpen} onClose={handleIncorrectClose} severity="error" message={errorMessage} />
      <SnackbarAlert open={twoFactorEnabledOpen} onClose={handleTwoFactorEnabledClose} severity="warning" message="Two Factor Authentication is Enabled" />
    </div>
  );
};

export default UnauthenticatedApp;
