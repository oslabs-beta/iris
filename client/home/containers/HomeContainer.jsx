import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import RightPane from './RightPane.jsx';
import LeftPane from './LeftPane.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#455a64',
      darker: '#053e85',
    },
  },
});

function HomeContainer({ loading }) {

  return (
    (loading) ? <ThemeProvider theme={theme}>
        <Box sx={{ 
          width: '90%', 
          height: '100%',
          p: 4,
          pt:25,
          m: 0, 
          }}>
          <LinearProgress color='primary' />
        </Box>
      </ThemeProvider> : (
      <div id='homePage'>
        <LeftPane />
        <RightPane />
      </div>
    )
  )
};

export default HomeContainer;
