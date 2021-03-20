import React, {useState} from 'react';
import Form from 'components/misc/Form/Form';
import { InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/VisibilityRounded';
import VisibilityOff from '@material-ui/icons/VisibilityOffRounded';
import { hooks } from 'functions/hooks';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

const ChangePasswordForm=props=>{
  const {close, changeAdminPassword} = props
  const changeAdminPasswordRequest=hooks.useRequest()
  const [_passwordVisible, _setPasswordVisible] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const handleClickShowPassword = () => {
    _setPasswordVisible(!_passwordVisible)
  }

  const onSubmit=values=>{
    changeAdminPasswordRequest.execute({
      action: () => changeAdminPassword(values.password),
      success: (res) => {
        enqueueSnackbar(`Le nouveau mot de passe à bien été enregistré`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant :'error' })
      }
    })
  }

  const changePasswordInputs=[
    {
      name: 'password',
      label: 'Mot de passe',
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
      validation: { required: 'Champs requis' }
    },
    {
      name: 'password_confirmation',
      label: 'Confirmer mot de passe',
      type: 'password',
      validation: { required: 'Champs requis' },
      combinedValdation: (values) => values.password === values.password_confirmation || "Les mots de passe ne se correspondent pas"
    }
  ]
  return (
    <div className='ChangePasswordForm'>
      <Form title="Changement mot de passe"
        inputs={changePasswordInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={changeAdminPasswordRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default ChangePasswordForm;