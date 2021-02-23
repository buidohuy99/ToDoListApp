import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#9C4A08',
      contrastText: "#fff"
    },
    secondary: {
      main: '#E8A100',
      contrastText: "#fff"
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});