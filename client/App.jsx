import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';

import HomeContainer from './home/containers/HomeContainer.jsx';
import NavBar from './home/components/NavBar.jsx';
// boilerplate
// import Login from './Login.jsx';
// import Signup from './Signup.jsx';
// import HomeContainer from './HomeContainer.jsx';
// import GraphContainer'./GraphContainer.jsx';

import './stylesheets/application.scss';

function App(props) {

  const [loading, setLoading] = useState(true)

  const socket = io();
  socket.on('load', (res) => {
    if (res.load) setLoading(false)
    console.log('intial socket received: ', loading)
  })

  return (
    <Router>
      <NavBar />
      <Switch>

        <Route path='/' render={() => <HomeContainer loading={loading}/>} />
        {/* <Route exact path='/' component={LaunchContainer} />
        <Route path='/signup' component={Signup}/>
        <Route path='/login' component={Login}/>
        <Route path='/profile' component={Profile}/> */}

      </Switch>
    </Router>
  )

}

export default App;
