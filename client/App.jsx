import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Routes } from 'react-router-dom';
import HomeContainer from './home/containers/HomeContainer.jsx';
import NavBar from './home/components/NavBar.jsx';

import './stylesheets/application.scss';

// boilerplate
// import Login from './Login.jsx';
// import Signup from './Signup.jsx';
// import HomeContainer from './HomeContainer.jsx';
// import GraphContainer'./GraphContainer.jsx';

function App(props) {

  return (
    <Router>
      <NavBar />
      <Switch>

        <Route path='/' component={HomeContainer} />
        {/* <Route exact path='/' component={LaunchContainer} />
        <Route path='/signup' component={Signup}/>
        <Route path='/login' component={Login}/>
        <Route path='/profile' component={Profile}/> */}

      </Switch>
    </Router>
  )

}

export default App;
