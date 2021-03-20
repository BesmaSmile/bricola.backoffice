import React, {useRef} from 'react';
import { Line} from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const LineChart = props => {
  const { labels, datasets, title } = props
  const chartRef=useRef()
  const options = {
    legend: {
      display: datasets.length > 1,
      position: 'bottom'
    },
    title: {
      display: true,
      text: title,
      fontSize: 25,
      fontColor: '#4F4C4C',
      fontStyle: undefined
    },
    plugins: {
      datalabels: {
        display: true,
        color: '#4F4C4C',
        backgroundColor: 'gainsboro',
        opacity: 0.7,
        borderRadius: 3,
        align: 'top',
      }
    }
  }
  const chartOptions = {
    fill: false,
    lineTension: 0.2,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor : 'rgb(2, 68, 99)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderWidth: 6,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointRadius: 3,
    pointHitRadius: 10,
    pointBorderColor: 'rgb(68, 170, 218)',
    pointBackgroundColor: 'rgb(68, 170, 218)',
    pointHoverBackgroundColor: 'rgb(68, 170, 218)',
    pointHoverBorderColor: 'rgb(68, 170, 218)'
  }
  const data = {
    labels: labels,
    datasets: datasets.map(dataset => ({ ...dataset, ...chartOptions, backgroundColor : 'rgb(68, 170, 218)'}))
  }
  return (
    <Line ref={chartRef} data={data} options={options} type='horizontalBar'/>
  )

}

export default LineChart;
