import { createMuiTheme } from '@material-ui/core/styles';
import { lightBlue, indigo, red } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: indigo,
    error: red,
  },
});

export default theme;
