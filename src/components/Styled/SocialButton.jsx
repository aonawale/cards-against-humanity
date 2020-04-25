import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const SocialButton = withStyles((theme) => ({
  root: {
    maxWidth: '240px',
    minHeight: '40px',
    width: '100%',
    backgroundColor: '#ffffff',
    textTransform: 'none',
    margin: theme.spacing(1),
    '& .MuiButton-iconSizeMedium > *:first-child': {
      fontSize: '24px',
    },
  },
  label: {
    justifyContent: 'start',
  },
  startIcon: {
    marginRight: theme.spacing(2),
  },
}))(Button);

export default SocialButton;
