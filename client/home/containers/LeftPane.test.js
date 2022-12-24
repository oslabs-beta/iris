import React from 'react';
import { render, screen } from '@testing-library/react';
import LeftPane from './LeftPane.jsx';

describe('LeftPane test', () => {

  it('LeftPane component renders correctly', () => {
    render(<LeftPane />);
  
    // Check if the NumberContainer component is rendered
    expect(screen.getByTestId('number-container')).toBeTruthy();
  
    // Check if the BarChart components are rendered
    expect(screen.getByTestId('bar-chart-kafka_jvm_heap_usage')).toBeTruthy();
    expect(screen.getByTestId('bar-chart-kafka_jvm_non_heap_usage')).toBeTruthy();
  
    // Check if the PieChart component is rendered
    expect(screen.getByTestId('pie-chart-pieChart')).toBeTruthy();
  });

})