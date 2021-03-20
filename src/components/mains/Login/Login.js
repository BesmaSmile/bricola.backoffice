import React, {useState} from 'react';
import Form from 'components/misc/Form/Form';
import './Login.scss';
import {useHistory} from "react-router-dom";
import { userActions } from 'store/actions';
import {connect} from 'react-redux';
import { InputAdornment, IconButton  } from '@material-ui/core';
import Visibility from '@material-ui/icons/VisibilityRounded';
import VisibilityOff from '@material-ui/icons/VisibilityOffRounded';
import Logo from 'components/misc/Logo/Logo';
import { hooks } from 'functions';
import { useSnackbar } from 'notistack';

const Login=(props) =>{
  const history=useHistory()
  const loginRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();
  const [_passwordVisible, _setPasswordVisible]=useState(false)

  const handleClickShowPassword = () => {
    _setPasswordVisible(!_passwordVisible)
  }

  const onSubmit = values => { 
    loginRequest.execute({
      action : ()=>props.login(values),
      success : ()=> history.replace('/'),
      failure : (error)=>enqueueSnackbar(error, { variant: 'error' })
    })
  }

  const loginInputs=[
    {
      name:'email',
      label:"Email",
      validation: {required: "Email requis"}
    },
    {
      name:'password',
      label:'Mot de passe',
      type: _passwordVisible ? 'text' : 'password',
      endAdornment:
        <InputAdornment position="end">
          <IconButton
            edge="end"
            onClick={handleClickShowPassword}
          >
              {_passwordVisible ? <VisibilityOff /> : <Visibility /> }
          </IconButton>
        </InputAdornment>,
      validation: {required: 'Mot de passe requis'}
    }
  ]
  
  return (
    <div className='Login relh100vh flex col aic'>
      <div className='w300'>
        <div className='marb20'><Logo  smallSiz={18} bigSize={80} lineHeight={80}/></div>
        <Form inputs={loginInputs} 
          onSubmit={onSubmit} 
          submitText='Se connecter'
          pending={loginRequest.pending}
        />
      </div>
    </div>
  );
}

const actionCreators = {
  login: userActions.login
}

export default connect(()=>({}),actionCreators)(Login);