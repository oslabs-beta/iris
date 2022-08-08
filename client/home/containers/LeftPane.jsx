import React, { Component, useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import BarChart from '../components/charts/BarChart.jsx';
import PieChart from '../components/charts/PieChart.jsx';



function LeftPane(props) {

    const leftPaneCharts = [<BarChart />, <BarChart />, <PieChart />]

    // pie chart -> bar chart -> bar chart
    return (
        <div id='leftPane'>
            {leftPaneCharts}
        </div>
    )
}

export default LeftPane;