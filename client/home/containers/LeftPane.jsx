import React, { Component, useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import BarChart from '../components/charts/BarChart.jsx';
import PieChart from '../components/charts/PieChart.jsx';
import NumberContainer from './NumberContainer.jsx';



function LeftPane(props) {

  const leftPaneCharts = [
    <NumberContainer/>,
    <BarChart chartID={'kafka_jvm_heap_usage'} />, 
    <BarChart chartID={'kafka_jvm_non_heap_usage'} />, 
    <PieChart chartID={'pieChart'} />
  ]

  // pie chart -> bar chart -> bar chart
  return (
    <div id='leftPane'>
      {leftPaneCharts}
    </div>
  )
}

export default LeftPane;