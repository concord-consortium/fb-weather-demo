import { createMuiTheme } from 'material-ui-next/styles';
import cyan from 'material-ui-next/colors/cyan';
import pink from 'material-ui-next/colors/pink';
import red from 'material-ui-next/colors/red';

// create a version of the 0.x default lightBaseTheme
const defaultTheme = createMuiTheme({
                        palette: {
                          primary: cyan,
                          secondary: pink,
                          error: red,
                        }
                      });
defaultTheme.palette.primary.contrastText = '#FFF';

export default defaultTheme;
