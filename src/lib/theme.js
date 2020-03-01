import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const createTheme = (override = {}) => createMuiTheme({
  ...override,
});

export {
  createTheme,
  ThemeProvider,
};
