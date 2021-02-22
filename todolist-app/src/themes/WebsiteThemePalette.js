import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#9C4A08',
    },
    secondary: {
      main: '#E8A100',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});