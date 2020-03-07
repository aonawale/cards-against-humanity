import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const TabPanel = memo(({
  children, value, index, ...other
}) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...other}
  >
    {value === index && children}
  </Typography>
));

TabPanel.propTypes = {
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default TabPanel;
