import React from 'react';
import Sidebar from 'components/misc/Sidebar/Sidebar';
import "./MainLayout.scss";

const MainLayout=(props)=>{
  return(
    <div className="MainLayout flex fdr">
      <Sidebar className='w240'/>
      <div className="ml-container marl240 flex f1 relh100vh blight">
        {props.children}
      </div>
    </div>
  )
}

export default MainLayout