/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AccordionActions,
  AccordionDetails,
  Button,
  CircularProgress,
  Fade,
  Typography,
  TextField,
  makeStyles,
  Divider,
  Link,
  Grid,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Refresh } from '@material-ui/icons';

import { useQuery, useMutation } from '@apollo/client';

import qrcode from 'qrcode';

import { FullPanelSpinner } from 'components/lib';

import { TWO_FACTOR_ENABLED } from 'graphql/Queries';

import {
  ENABLE_TWO_FACTOR,
  DISABLE_TWO_FACTOR,
} from 'graphql/Mutations';

const useStyles = makeStyles((theme) => ({
  details: {
    alignItems: 'center',
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

  button: {
    margin: theme.spacing(1),
  },
}));

const TwoFactorPanel = (props) => {
  const { otpAuth, secret, onRegenerateClick } = props;
  const classes = useStyles();

  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const {
    error: twoFactorError,
    data: twoFactorData,
    loading: twoFactorLoading,
    refetch: twoFactorRefetch,
  } = useQuery(TWO_FACTOR_ENABLED, {
    fetchPolicy: 'network-only',
  });

  const [enableTwoFactor, {
    loading: enableTwoFactorLoading,
    error: enableTwoFactorError,
  }] = useMutation(ENABLE_TWO_FACTOR, {
    onCompleted: () => {
      setTimeout(() => {
        twoFactorRefetch();
      }, 500);
    },
  });

  const [disableTwoFactor, {
    loading: disableTwoFactorLoading,
    error: disableTwoFactorError,
  }] = useMutation(DISABLE_TWO_FACTOR, {
    onCompleted: () => {
      setTimeout(() => {
        twoFactorRefetch();
      }, 500);
    },
  });

  useMemo(() => qrcode.toDataURL(otpAuth, (err, imageUrl) => {
    if (err) {
      console.log('error with QR');
    } else {
      setQrCodeUrl(imageUrl);
    }
  }), [otpAuth]);

  const handleSave = (event) => {
    event.preventDefault();
    enableTwoFactor({
      variables: {
        token: twoFactorCode,
        secret,
      },
    });
  };

  const handleDisable = (event) => {
    event.preventDefault();
    disableTwoFactor({
      variables: {
        password,
      },
    });
  };

  if (twoFactorLoading || twoFactorError) {
    return (<Fade in><FullPanelSpinner /></Fade>);
  }
  if (twoFactorData.twoFactorEnabled) {
    return (
      <>
        <AccordionDetails>
          <Fade in>
            <Grid container spacing={3} justify="space-around" alignItems="baseline">
              <Grid item sm={8}>
                <Typography variant="body2">
                  Enter your password to disable Two-Factor Authentication
                </Typography>
                <Typography variant="body2">
                  Remember that this reduces the security of your account,
                  so please be sure you wish to continue
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <form onSubmit={handleDisable}>
                  <TextField
                    required
                    label="Password"
                    variant="outlined"
                    type="password"
                    error={!!disableTwoFactorError}
                    helperText={disableTwoFactorError ? disableTwoFactorError.message : ' '}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </form>
              </Grid>
            </Grid>
          </Fade>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Fade in>
            <div className={classes.buttonWrapper}>
              <Button
                color="primary"
                size="small"
                disabled={disableTwoFactorLoading}
                onClick={handleDisable}
              >
                Disable
              </Button>
              {disableTwoFactorLoading
          && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </Fade>
        </AccordionActions>
      </>
    );
  }
  return (
    <React.Fragment>
      <AccordionDetails>
        <Fade in>
          <Grid container>
            <Grid item sm={4}>
              <Grid container>
                <Grid item sm={12}>
                  <Typography variant="body2">
                    <strong>1.</strong>
                    {' '}
                    Scan the QR Code displayed in an app like
                    {' '}
                    <Link href="https://support.google.com/accounts/answer/1066447" rel="noopener noreferrer" target="_blank">Google Authenticator</Link>
                    {' '}
                    or type the secret into the app
                  </Typography>
                </Grid>
                <Grid item sm={12}>
                  <Button
                    onClick={onRegenerateClick}
                    className={classes.button}
                    startIcon={<Refresh />}
                  >
                    Regenerate
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={4}>
              <Grid container>
                <Grid item sm={12}>
                  {qrCodeUrl === ''
                    ? <Skeleton variant="rect" height="400px" />
                    : <img src={qrCodeUrl} alt="2FA QR Code" /> }
                </Grid>
                <Grid item sm={12}>
                  <Typography variant="caption">
                    Secret:
                    {' '}
                    {secret}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={4}>
              <Grid container spacing={3} justify="space-around">
                <Grid item sm={12}>
                  <Typography variant="body2" gutterBottom>
                    <strong>2.</strong>
                    {' '}
                    Then type the time based code displayed in the app here and click save
                  </Typography>
                </Grid>
                <Grid item sm={12}>
                  <form onSubmit={handleSave}>
                    <TextField
                      required
                      label="2FA Code"
                      variant="outlined"
                      autoComplete="false"
                      type="number"
                      error={!!enableTwoFactorError}
                      helperText={enableTwoFactorError ? enableTwoFactorError.message : ' '}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                    />
                  </form>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Fade>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Fade in>
          <div className={classes.buttonWrapper}>
            <Button
              color="primary"
              size="small"
              disabled={enableTwoFactorLoading}
              onClick={handleSave}
            >
              Save
            </Button>
            {enableTwoFactorLoading
          && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </Fade>
      </AccordionActions>
    </React.Fragment>
  );
};

TwoFactorPanel.propTypes = {
  otpAuth: PropTypes.string.isRequired,
  secret: PropTypes.string.isRequired,
  onRegenerateClick: PropTypes.func.isRequired,
};

export default TwoFactorPanel;
