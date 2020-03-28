import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

const TabPanel = memo(({
  children, value, index, ...other
}) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    width="100%"
    height="100%"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...other}
  >
    {value === index && children}
  </Box>
));

TabPanel.propTypes = {
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default TabPanel;
