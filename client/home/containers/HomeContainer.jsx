import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import RightPane from './RightPane.jsx';
import LeftPane from './LeftPane.jsx';

function HomeContainer({ loading }) {

  return (
    (loading) ? <Box sx={{ 
        width: '90%', 
        height: '100%',
        p: 4,
        pt:25,
        m: 0
        }}>
        <LinearProgress />
      </Box> : (
      <div id='homePage'>
        <LeftPane />
        <RightPane />
      </div>
    )
  )
};

export default HomeContainer;
