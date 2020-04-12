import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  infoBox: {
    padding: '16px',
    whiteSpace: 'nowrap',
    width: '100%',
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

const Info = memo(({ title, subtitle, children }) => (
  <Box textAlign="center" py={1}>
    <Typography variant="h5" component="h1">
      {title}
    </Typography>
    {subtitle && <Box>{subtitle}</Box>}

    <Box className={useStyles().infoBox}>
      {children}
    </Box>
  </Box>
));

Info.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default Info;
