import React, { Component, useState, useEffect } from 'react';
import GraphContainer from './GraphContainer.jsx';

function HomeContainer(props) {
    // implement adding new graphs logic 
    // always want one graph
    const [currentGraphs, setGraphs] = useState([<GraphContainer chartID={'1'} />]);

    // function that will create new graphs onClick button id = newGraph
    function createGraph() {
        const holder = [...currentGraphs];
        console.log('holder, ', String(currentGraphs.length + 1))
        holder.push(<GraphContainer chartID={String(currentGraphs.length + 1)} />);
        setGraphs(holder)

    };

    return (
        <div className='homePage'>
            <button id='newGraph' onClick={createGraph}>Add a Graph</button>
            <div id='graphFeed'>{currentGraphs}</div>
        </div>

    )
}

export default HomeContainer;
