import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import avatar from 'assets/img/user.svg';
import Logo from 'components/misc/Logo/Logo';
import { connect } from 'react-redux';
import { userActions } from 'store/actions';
import { withRouter } from "react-router";

import './Sidebar.scss'

const Sidebar = (props) => {
  const history = useHistory()

  const handleLogout = () => {
    props.logout()
    history.replace('/')
  }

  return (
    <div className={`Sidebar relh100vh ${props.className || ''}`}>
      <div className='sidebar-wrapper mar20'>
        <div className='padv15'>
          <Logo />
        </div>
        <div className='sidebar-user flex row aic padv20 padh15'>
          <img className='circle' src={avatar} alt='' />
          <div className='flex col marl20'>
            <span className='cstronggrey medium fs16'>{props.user.firstname} {props.user.lastname} </span>
            <span className='cstronggrey extralight fs12'>{props.user.email}</span>
          </div>
        </div>
        <div className="sidebar-items padv20 flex col" >
          {props.items.map(item => (
            <Link to={item.path} key={item.name}
              className='sidebar-item pointer cgrey mar15 brad5'
              active={props.location.pathname === item.path ? 'true' : 'false'}>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className='sidebar-logout pointer marh40 marv20 cgrey bold' onClick={handleLogout}>Déconnexion</div>
    </div>
  )
}

Sidebar.defaultProps = {
  items: [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Commandes', path: '/orders' },
    { name: 'Réclamations', path: '/reclamations' },
    { name: 'Entreprises', path: '/companies' },
    { name: 'Partenaires', path: '/partners' },
    { name: 'Clients', path: '/clients' },
    { name: 'Paiement', path: '/payment' },
    { name: 'Codes promo', path: '/promo_codes' },
    { name: 'Services', path: '/services' },    
    { name: 'Publications', path: '/publications' },    
    { name: 'Administrateurs', path: '/administrateurs' }
  ],
  className: 'w240'
}
const mapState = (state) => ({
  user: state.user.user
})

const actionCreators = {
  logout: userActions.logout
}

export default connect(mapState, actionCreators)(withRouter(Sidebar));
