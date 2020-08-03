/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
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

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useQuery, useMutation } from '@apollo/client';

import { authenticator } from 'otplib';
import qrcode from 'qrcode';

import { FullPanelSpinner } from 'components/lib';

import {
  ME, TWO_FACTOR_ENABLED, ENABLE_TWO_FACTOR, DISABLE_TWO_FACTOR,
} from 'graphql/Queries';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  personalRoot: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
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
}));

const TwoFactorPanel = (props) => {
  const { otpAuth, secret } = props;
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
    errorPolicy: 'none',
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
    errorPolicy: 'none',
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
        <AccordionDetails className={classes.details}>
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
    <>
      <AccordionDetails className={classes.details}>
        <Fade in>
          <>
            <div className={classes.column}>
              <Typography variant="body2">
                <strong>1.</strong>
                {' '}
                Scan the QR Code displayed in an app like
                {' '}
                <Link href="https://support.google.com/accounts/answer/1066447" rel="noopener noreferrer" target="_blank">Google Authenticator</Link>
              </Typography>
            </div>
            <div className={classes.column}>
              {qrCodeUrl === ''
                ? <Skeleton variant="rect" height="400px" />
                : <img src={qrCodeUrl} alt="2FA QR Code" /> }
              <Typography variant="caption">
                Secret:
                {' '}
                {secret}
              </Typography>
            </div>
            <div className={classes.column}>
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
            </div>
          </>
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
    </>
  );
};

TwoFactorPanel.propTypes = {
  otpAuth: PropTypes.string.isRequired,
  secret: PropTypes.string.isRequired,
};

const ProfilePage = () => {
  const classes = useStyles();

  const [accordianExpanded, setAccordianExpanded] = React.useState('personal');

  const { data: personalData, loading: personalLoading } = useQuery(ME, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'ignore',
  });

  const [twoFactorSecret, setTwoFactorSecret] = useState(authenticator.generateSecret());

  const otpAuth = useMemo(() => {
    if (personalData) {
      return authenticator.keyuri(
        personalData.me.username,
        personalData.me.company.name,
        twoFactorSecret,
      );
    }
    return '';
  }, [personalData, twoFactorSecret]);

  const handleAccordianToggle = (panel) => (event, isExpanded) => {
    setAccordianExpanded(isExpanded ? panel : false);
  };

  return (
    <Fade in>
      <div className={classes.root}>
        <Accordion expanded={accordianExpanded === 'personal'} onChange={handleAccordianToggle('personal')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>Profile</Typography>
            <Typography className={classes.secondaryHeading}>Personal details and info</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {personalLoading ? <FullPanelSpinner />
              : (
                <form className={classes.personalRoot} noValidate autoComplete="off">
                  <TextField label="Username (Login)" variant="outlined" disabled defaultValue={personalData.me.username} />
                  <TextField label="First name" variant="outlined" defaultValue={personalData.me.firstname} />
                  <TextField label="Last name" variant="outlined" defaultValue={personalData.me.lastname} />
                </form>
              )}
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={accordianExpanded === 'password'} onChange={handleAccordianToggle('password')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>Password</Typography>
            <Typography className={classes.secondaryHeading}>
              Change your password
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            Empty for now
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={accordianExpanded === '2fa'} onChange={handleAccordianToggle('2fa')} TransitionProps={{ unmountOnExit: false }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>2FA</Typography>
            <Typography className={classes.secondaryHeading}>
              Two-Factor Authentication Setup
            </Typography>
          </AccordionSummary>
          <TwoFactorPanel otpAuth={otpAuth} secret={twoFactorSecret} />
        </Accordion>
        <Accordion expanded={accordianExpanded === 'other'} onChange={handleAccordianToggle('other')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography className={classes.heading}>Other settings</Typography>
            <Typography className={classes.secondaryHeading}>
              Some other settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dapibus
              in erat sit amet rutrum. Curabitur viverra accumsan tincidunt. Ut tristique
              tincidunt felis sit amet volutpat. Aenean quis orci finibus, malesuada mauris vel,
              efficitur velit. Praesent efficitur lectus mi, in sollicitudin odio venenatis a.
              Vestibulum a nibh sit amet urna consectetur dictum. Donec vehicula auctor enim
              a vehicula. Interdum et malesuada fames ac ante ipsum primis in faucibus.
              Duis lacinia sodales libero, vel ornare tellus condimentum nec. Curabitur arcu
              urna, mattis hendrerit vehicula facilisis, molestie eu augue.
              Donec hendrerit leo quis odio laoreet lobortis. Donec dui nisi, laoreet at ipsum
              quis, porta condimentum augue. Nam in neque scelerisque, aliquam purus vitae,
              maximus erat. Curabitur at ligula tincidunt, commodo eros eu, congue tortor.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={accordianExpanded === 'panel4'} onChange={handleAccordianToggle('panel4')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography className={classes.heading}>Personal data</Typography>
            <Typography className={classes.secondaryHeading}>
              See how we store and use your data
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dapibus
              in erat sit amet rutrum. Curabitur viverra accumsan tincidunt. Ut tristique
              tincidunt felis sit amet volutpat. Aenean quis orci finibus, malesuada mauris vel,
              efficitur velit. Praesent efficitur lectus mi, in sollicitudin odio venenatis a.
              Vestibulum a nibh sit amet urna consectetur dictum. Donec vehicula auctor enim
              a vehicula. Interdum et malesuada fames ac ante ipsum primis in faucibus.
              Duis lacinia sodales libero, vel ornare tellus condimentum nec. Curabitur arcu
              urna, mattis hendrerit vehicula facilisis, molestie eu augue.
              Donec hendrerit leo quis odio laoreet lobortis. Donec dui nisi, laoreet at ipsum
              quis, porta condimentum augue. Nam in neque scelerisque, aliquam purus vitae,
              maximus erat. Curabitur at ligula tincidunt, commodo eros eu, congue tortor.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Fade>
  );
};

export default ProfilePage;
