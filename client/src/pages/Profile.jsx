/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import React, { useMemo, useState } from 'react';
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
  Grid,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useQuery, useMutation } from '@apollo/client';

import { authenticator } from 'otplib';

import { FullPanelSpinner } from 'components/lib';
import SnackbarAlert from 'components/SnackbarAlert';

import {
  ME,
} from 'graphql/Queries';

import {
  CHANGE_PASSWORD,
} from 'graphql/Mutations';

import TwoFactorPanel from './profile/TwoFactorPanel';

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

  button: {
    margin: theme.spacing(1),
  },
}));

const ChangePasswordPanel = () => {
  const classes = useStyles();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [changePassword, { loading, error }] = useMutation(CHANGE_PASSWORD, {
    errorPolicy: 'none',
    onError: () => {
      setSnackbarOpen(true);
    },
    onCompleted: () => {
      setSnackbarOpen(true);
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    },
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (oldPassword === newPassword) {
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      return;
    }

    changePassword({
      variables: {
        oldPassword,
        newPassword,
      },
    });
  };

  const textErrorLabel = () => {
    if (!oldPassword) {
      return ' ';
    }

    if (oldPassword === newPassword) {
      return 'Old password is the same';
    }

    return ' ';
  };

  const textErrorConfirmLabel = () => {
    if (newPassword !== newPasswordConfirm && newPasswordConfirm) {
      return 'Passwords don\'t match';
    }
    return ' ';
  };

  const textError = () => (textErrorLabel() !== ' ');
  const textErrorConfirm = () => (textErrorConfirmLabel() !== ' ');

  return (
    <React.Fragment>
      <AccordionDetails>
        <Grid container spacing={1}>
          <Grid item sm={4}>
            {/* Use form only on old password to allow for autofillers to work */}
            <form onSubmit={handleSave}>
              <TextField
                variant="outlined"
                type="password"
                label="Old Password"
                value={oldPassword}
                disabled={loading}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </form>
          </Grid>
          <Grid item sm={4}>
            <TextField
              variant="outlined"
              type="password"
              label="New Password"
              value={newPassword}
              disabled={loading}
              error={textError()}
              helperText={textErrorLabel() || ' '}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Grid>
          <Grid item sm={4}>
            <TextField
              variant="outlined"
              type="password"
              label="New Password Again"
              value={newPasswordConfirm}
              disabled={loading}
              error={textErrorConfirm()}
              helperText={textErrorConfirmLabel()}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              onSubmit={handleSave}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSave(e); }}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Fade in>
          <div className={classes.buttonWrapper}>
            <Button
              color="primary"
              size="small"
              disabled={loading}
              onClick={handleSave}
            >
              Save
            </Button>
            {loading
          && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </Fade>
      </AccordionActions>

      <SnackbarAlert
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={error ? 'error' : 'success'}
        message={error ? error.message : 'Password Changed'}
        vertical="top"
        horizontal="center"
      />
    </React.Fragment>
  );
};

const ProfilePage = () => {
  const classes = useStyles();

  const [accordianExpanded, setAccordianExpanded] = useState('personal');

  const { data: personalData, loading: personalLoading } = useQuery(ME, {
    fetchPolicy: 'cache-first',
  });

  const [twoFactorSecret, setTwoFactorSecret] = useState(authenticator.generateSecret());

  const otpAuth = useMemo(() => {
    if (personalData) {
      return authenticator.keyuri(
        personalData.me.email,
        personalData.me.company.name,
        twoFactorSecret,
      );
    }
    return '';
  }, [personalData, twoFactorSecret]);

  const handleAccordianToggle = (panel) => (event, isExpanded) => {
    setAccordianExpanded(isExpanded ? panel : false);
  };

  const handleRegenerateTwoFactorSecret = () => {
    setTwoFactorSecret(authenticator.generateSecret());
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
          <ChangePasswordPanel />
        </Accordion>
        <Accordion expanded={accordianExpanded === '2fa'} onChange={handleAccordianToggle('2fa')} TransitionProps={{ unmountOnExit: false }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>2FA</Typography>
            <Typography className={classes.secondaryHeading}>
              Two-Factor Authentication Settings
            </Typography>
          </AccordionSummary>
          <TwoFactorPanel
            otpAuth={otpAuth}
            secret={twoFactorSecret}
            onRegenerateClick={handleRegenerateTwoFactorSecret}
          />
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
