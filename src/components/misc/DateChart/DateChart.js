import React from 'react';
import LineChart from 'components/misc/LineChart/LineChart';
import {format} from 'date-fns';

const OrderChart=props=>{
  const {filter, elements, title}=props
  let frm;
  switch(filter){
    case 'month':
      frm='dd/MM/yyyy'
      break;
    case 'year':
      frm='MM/yyyy'
      break;
    case 'all':
      frm='yyyy'
      break;
    default : break;
  }

  const dates=[...new Set(elements.sort((e1,e2)=>e1.createdAt-e2.createdAt).map(element=>format(element.createdAt, frm)))]; 
  const data=dates.map(date=>elements.filter(element=>format(element.createdAt, frm)===date).length)

  return (
    <div className='relw100'>
      <LineChart title={title} labels={dates} datasets={[{data}]}/>
    </div>
  )
}

export default OrderChart