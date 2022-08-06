import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import testlogo from '../assets/IRIS.png'

function NavBar() {
    return (
        <nav className='navbar'>
            <a href='/' className='site-title'><img src={testlogo} id = "iris-logo"/>IRIS</a>
            <ul>
                <li>
                    <a href='/home'>Metrics</a>
                </li>
                <li>
                    <a href='/login'>Login</a>
                </li>
                <li>
                    <a href='/signup'>Signup</a>
                </li>
            </ul>
        </nav>
    )
}

// return (
// <div>
//     {/* <Link to={{
//           pathname: ,
//           state: 
//           }}></Link> */}
// </div>
// )

export default NavBar;