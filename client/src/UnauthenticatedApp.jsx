/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green, red } from '@material-ui/core/colors';
import {
  Button, Paper, TextField, Typography, CircularProgress, Collapse, Fade, Link,
} from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';

import SnackbarAlert from 'components/SnackbarAlert';

import { IS_LOGGED_IN, COMPANY_NAME } from 'graphql/Queries';
import { LOGIN } from 'graphql/Mutations';
import localStorageKey from 'utils/LocalStorageKey';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    padding: theme.spacing(3),
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

const subdomain = getSubdomain();

const hasCompany = getSubdomain() !== '';

const UnauthenticatedApp = (props) => {
  // const client = useApolloClient();
  const classes = useStyles();

  const { onLogin } = props;

  const [incorrectOpen, setIncorrectOpen] = useState(false);
  const [twoFactorEnabledOpen, setTwoFactorEnabledOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [company, setCompany] = useState(subdomain);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: companyNameData,
    loading: companyNameLoading,
    error: companyNameError,
  } = useQuery(COMPANY_NAME, {
    skip: !hasCompany,
    variables: {
      code: company,
    },
    errorPolicy: 'none',
    // really nasty workaround
    // see https://github.com/apollographql/apollo-client/issues/6190
    fetchPolicy: !hasCompany ? 'cache-only' : 'cache-first',
  });

  const [loginMutation, {
    loading: loginLoading, client,
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

  const changeCompany = (event) => {
    event.preventDefault();
    window.location.host = process.env.REACT_APP_BASE_DOMAIN;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasCompany) {
      window.location.host = `${company}.${process.env.REACT_APP_BASE_DOMAIN}`;
    } else if (!loginLoading && !success) {
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

  const preventDefault = (event) => {
    event.preventDefault();
  };

  const companyEnteredFormContents = (
    <React.Fragment>
      <TextField
        required
        autoFocus
        label="Username"
        variant="filled"
        disabled={loginLoading || success}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        required
        label="Password"
        type="password"
        variant="filled"
        disabled={loginLoading || success}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Collapse in={twoFactorEnabled}>
        <TextField
          label="2FA code"
          variant="filled"
          required={twoFactorEnabled}
          disabled={!twoFactorEnabled || loginLoading || success}
          onChange={(e) => setTwoFactor(e.target.value)}
        />
      </Collapse>
      <div className={classes.buttonWrapper}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loginLoading || success}
        >
          Login
        </Button>
        {loginLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </React.Fragment>
  );

  const companyCodeFormContents = (
    <React.Fragment>
      <TextField
        required
        autoFocus
        label="Company"
        helperText="Your company's code"
        variant="filled"
        disabled={loginLoading || success || getSubdomain() !== ''}
        value={company.toUpperCase()}
        onChange={(e) => setCompany(e.target.value.toLowerCase())}
      />
      <div className={classes.buttonWrapper}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loginLoading || success}
        >
          Go
        </Button>
        {loginLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </React.Fragment>
  );

  const companyNotFound = (
    <React.Fragment>
      <Typography>
        Company not found for code
        {' '}
        {company.toUpperCase()}
      </Typography>
      <Button onClick={changeCompany}>Go back</Button>
    </React.Fragment>
  );

  const formContents = () => {
    if (hasCompany) {
      if (companyNameLoading) {
        return (
          <CircularProgress size={24} />
        );
      }
      if (!companyNameError) {
        return companyEnteredFormContents;
      }
      return companyNotFound;
    }
    return companyCodeFormContents;
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
          {!hasCompany
          && (
          <Typography variant="h3" gutterBottom>
            KiwiSheets
          </Typography>
          )}
          {hasCompany && !companyNameError && !companyNameLoading && (
            <React.Fragment>
              <Typography variant="h5" align="center">
                {companyNameLoading || companyNameError ? '' : companyNameData.companyName}
                {' '}
                Login
              </Typography>
              <Typography variant="subtitle1" align="center">
                You can come back here using
                <br />
                <Link href="/" onClick={preventDefault}>
                  {company.toUpperCase()}
                  .
                  {process.env.REACT_APP_BASE_DOMAIN.toUpperCase()}
                </Link>
              </Typography>
              <Typography>
                Not right?
                {' '}
                <Button onClick={changeCompany}>Go back</Button>
              </Typography>
            </React.Fragment>
          )}
          <form className={classes.form} onSubmit={handleSubmit}>
            {formContents()}
          </form>
        </Paper>
      </Fade>
      <SnackbarAlert
        open={incorrectOpen}
        onClose={handleIncorrectClose}
        severity="error"
        message={errorMessage}
        vertical="top"
        horizontal="center"
      />
      <SnackbarAlert
        open={twoFactorEnabledOpen}
        onClose={handleTwoFactorEnabledClose}
        severity="warning"
        message="Two Factor Authentication is Enabled"
        vertical="top"
        horizontal="center"
      />
    </div>
  );
};

UnauthenticatedApp.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default UnauthenticatedApp;
