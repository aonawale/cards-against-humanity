import React, { memo } from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  loader: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    background: '#fff',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const OverlayLoader = memo(() => (
  <Box className={useStyles().loader}>
    <CircularProgress />
  </Box>
));

export default OverlayLoader;
