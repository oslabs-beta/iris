import React, { Component, useState, useEffect } from 'react';
import RightPane from './RightPane.jsx';
import LeftPane from './LeftPane.jsx';


function HomeContainer(props) {
    // implement adding new graphs logic 
    // always want one graph
    const [currentGraphs, setGraphs] = useState([]);

    // function that will create new graphs onClick button id = newGraph
    function createGraph(e) {
        // const type = e.target.id.slice(3);
        // console.log('type', type)
        const holder = [...currentGraphs];
        console.log('holder, ', String(currentGraphs.length + 1))
        holder.push(<GraphContainer chartID={String(currentGraphs.length + 1)} key = {`graphContainer${currentGraphs.length + 1}`}/>);
        setGraphs(holder)

        const reqBody = {
            metric: 'kafka_server_broker_topic_metrics_bytesinpersec_rate',
            timeFrame: '5m',
            chartID: String(currentGraphs.length + 1)
        }

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        })
            .then((formattedData) => {
                console.log(formattedData)
            })
            .catch(err => {
                console.log('Error thrown in POST request in graphContainer: ', err)
            })
    };

    return (
        <div className='homePage'>
            <button id='newGraphContainer' onClick={(e) => createGraph(e)}>Add a Graph</button>
            {/* <button id='newBar' onClick={(e) => createGraph(e)}>Add a Histogram</button> */}
            <div id='graphFeed'>{currentGraphs}</div>
        </div>
    )
};

export default HomeContainer;
