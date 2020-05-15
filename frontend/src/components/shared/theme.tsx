import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import grey from '@material-ui/core/colors/grey';
import pink from '@material-ui/core/colors/pink';

export default createMuiTheme({
    palette: {
      primary: {
        light: '#484848',
        main: grey[900],
        dark: '#000000',
      },
      secondary: {
        light: '#ff5c8d',
        main: pink[600],
        dark: '#a00037',
      },
    },
  })