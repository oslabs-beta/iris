import React, { Component, useState, useEffect } from 'react';
import RightPane from './RightPane.jsx';
import LeftPane from './LeftPane.jsx';


function HomeContainer(props) {
    return (
        <div id='homePage'>
            <LeftPane />
            <RightPane />
        </div>
    )
};

export default HomeContainer;
