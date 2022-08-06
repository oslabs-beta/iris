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
            <button id='newGraph' onClick={createGraph}>Add a Graph</button>
            <div id='graphFeed'>{currentGraphs}</div>
        </div>
    )
};

export default HomeContainer;
