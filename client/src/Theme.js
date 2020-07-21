import { createMuiTheme } from '@material-ui/core/styles';
import {
  red, blueGrey, orange,
} from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: orange,
    error: red,
  },
});

export default theme;
