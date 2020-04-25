import SocialButton from 'components/Styled/SocialButton';
import { withStyles } from '@material-ui/core/styles';

const FacebookButton = withStyles({
  root: {
    backgroundColor: '#3b5998',
    color: '#ffffff',
  },
})(SocialButton);

export default FacebookButton;
