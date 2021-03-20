import React from 'react';

const Logo=props=>{
  const {lineHeight, bigSize, smallSize}=props
  return(
    <div className='Logo flex jcc aic col'>
      <div className={`bauhaus93 fs${bigSize} lh${lineHeight} cmain`}>BRICOLA</div>
      <span className={`cgrey txtac fs${smallSize} light cstronggrey`}>Transport & service à domicile</span>
    </div>
  )
}

Logo.defaultProps={
  lineHeight : 50, 
  bigSize : 50, 
  smallSize : 18
}
export default Logo