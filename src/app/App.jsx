import React from 'react';
import Box from '@material-ui/core/Box';
import Navbar from 'components/Navbar/Navbar';

const App = ({ children }) => (
  <Box height="100%">
    <Navbar />
    <main>{children}</main>
  </Box>
);

export default App;
