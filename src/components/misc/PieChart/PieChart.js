import React, {useRef} from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';


const PieChart = props => {
  const { labels, datasets, title, color, unit } = props
  const chartRef=useRef()
  const tooltips = {
    callbacks: {
      label: (tooltipItem, data) => {
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var currentValue = dataset.data[tooltipItem.index];
        return `${currentValue} ${unit ?? ''}`;
      }
    }
  } 

  const options = {
    //backgroundColor : color,
    tooltips,
    legend: {
      display: true,
      position: 'left',
      labels: {
        usePointStyle:true,
      }
    },
    title: {
      display: true,
      text: title,
      fontSize: 25,
      fontColor: '#4F4C4C',
      fontStyle: undefined,
      position :'top'
    },
    plugins: {
      datalabels: {
        display: true,
        color: 'black',
        backgroundColor: 'white',
        opacity: 0.7,
        borderRadius: 3,
        align: 'top',
        formatter: function(value, context) {
          var total =  context.dataset.data.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
          });
          var percentage = Math.floor(((value/total) * 100)+0.5);
          return  `${percentage || '0'}%`
        }
      }
    }
  }
  const chartOptions = {
    fill: false,
    lineTension: 0.2,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderWidth: 6,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointRadius: 3,
    pointHitRadius: 10,
    pointBorderColor: '#B43E5A',
    pointBackgroundColor: '#B43E5A',
    pointHoverBackgroundColor: 'rgba(220,220,220,1)',
    pointHoverBorderColor: '#B43E5A'
  }
  const data = {
    labels: labels,
    datasets: datasets.map(dataset => ({ ...dataset, ...chartOptions, backgroundColor : color }))
  }
  return (
    <Doughnut ref={chartRef} data={data} options={options} />
  )

}

const StatusChart = props=>{
  const {elements, status, title, statusField}=props 
  const data=status.map(status=>elements.filter(element=>element[statusField]===status.name).length)
  return (
    <div className='relw100'>
      <PieChart title={title} color={status.map(status=>status.color)} labels={status.map(status=>status.label)} datasets={[{data}]}/>
    </div>
  )
}

StatusChart.defaultProps = {
  statusField: 'status',
}

const AmountChart = props=>{
  const {elements, methods, title}=props 
  const data=methods.map(method=>
    elements.filter(element=>element.method===method.name)
    .map(element=>element.amount)
    .reduce((e1, e2) => e1+e2, 0)
  )
  return (
    <div className='relw100'>
      <PieChart title={title} color={methods.map(method=>method.color)} labels={methods.map(method=>method.label)} datasets={[{data}]} unit="DA" />
    </div>
  )
}

export { PieChart, StatusChart, AmountChart };
