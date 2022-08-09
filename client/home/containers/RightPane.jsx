import React, { Component, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import LineGraphContainer from './LineGraphContainer';
// import LineChart from '../components/charts/LineChart.jsx';

function RightPane(props) {
    // implement adding new graphs logic 
    // always want one graph
    const [currentGraphs, setGraphs] = useState([<LineGraphContainer chartID={'1'} />]);

    // function that will create new graphs onClick button id = newGraph
    function createGraph() {
        const holder = [...currentGraphs];
        console.log('holder, ', String(currentGraphs.length + 1))
        holder.push(<LineGraphContainer chartID={String(currentGraphs.length + 1)} />);
        setGraphs(holder)

        const reqBody = {
            metric: 'kafka_server_broker_topic_metrics_bytesinpersec_rate',
            timeFrame: '5m',
            chartID: String(currentGraphs.length + 1)
        }
        // fecthing for default data to render on initial start up
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
        <div id='rightPane'>
            <button id='newGraph' onClick={createGraph}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
            </button>
            <div id='graphFeed'>{currentGraphs}</div>
        </div>
    )
}

export default RightPane;