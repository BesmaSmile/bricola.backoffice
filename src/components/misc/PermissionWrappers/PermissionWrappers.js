import React from 'react';
import CancelIcon from '@material-ui/icons/CancelRounded';
import SecurityIcon from '@material-ui/icons/SecurityRounded';
import { connect } from 'react-redux';
import _ from 'lodash';
import './PermissionWrappers.scss';

const mapState = (state) => ({
  permissions : _.get(state.user, 'user.permissions', {})
})

const PageWrapper=connect(mapState)(props=>{
  const {permissions, page, name}=props

  if(permissions[name])
    return (<>{page}</>)
  else return (
    <div className='PageWrapper flex relw100 col aic jcc marb50'>
      <div className='pw-iconContainer marb40'>
        <SecurityIcon classes={{root :'pw-largIcon'}} fontSize='large'/>
        <CancelIcon classes={{root :'pw-smallIcon'}} fontSize='small'/>
      </div>
      <div className='fs20 cstronggrey'>Vous n'avez pas la permission pour afficher cette page. </div>
      <div className='fs14 cgrey extralight'> Demander à un administrateur de vous atttribuer la permission </div>
    </div>
  )
})

export {PageWrapper };


const ButtonWrapper=connect(mapState)(props=>{
  const {neededPermission, permissions, button}=props
  const disabled=!permissions[neededPermission]
  return button(disabled)
})

export {ButtonWrapper}

