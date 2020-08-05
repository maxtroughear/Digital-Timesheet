/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import Proptypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button, Fade, Card, CardContent, CardActions, Typography, makeStyles, Divider,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    minWidth: 175,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const NotFoundPage = () => {
  const classes = useStyles();
  return (
    <Fade in>
      <div
        css={{
          height: '100%',
          display: 'grid',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              404
            </Typography>
            <Typography variant="h5" component="h2">
              Sorry nothing found here
            </Typography>
          </CardContent>
          <Divider />
          <CardActions>
            <Button component={RouterLink} to="/">
              Go home
            </Button>
          </CardActions>
        </Card>
      </div>
    </Fade>
  );
};

NotFoundPage.propTypes = {
  location: Proptypes.shape({
    pathname: Proptypes.string.isRequired,
  }).isRequired,
};

export default NotFoundPage;
