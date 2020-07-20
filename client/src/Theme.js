import { createMuiTheme } from '@material-ui/core/styles';
import {
  red, blue, blueGrey,
} from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: blue,
    error: red,
  },
});

export default theme;
