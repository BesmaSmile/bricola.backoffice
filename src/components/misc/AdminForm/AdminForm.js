import React, {useState} from 'react';
import Form from 'components/misc/Form/Form';
import { InputAdornment, IconButton  } from '@material-ui/core';
import Visibility from '@material-ui/icons/VisibilityRounded';
import VisibilityOff from '@material-ui/icons/VisibilityOffRounded';
import { hooks, validator } from 'functions';

import { useSnackbar } from 'notistack';
import _ from 'lodash';

const AdminForm = props => {
  const { close, admin, updateAdmin, addAdmin } = props
  const adminRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();
  const [_passwordVisible, _setPasswordVisible]=useState(false)

  const handleClickShowPassword = () => {
    _setPasswordVisible(!_passwordVisible)
  }

  const onSubmit = values => {
    const toSend= values
    delete toSend.password_confirmation
    adminRequest.execute({
      action: () => admin ? updateAdmin(admin._id, toSend) : addAdmin(toSend),
      success: (res) => {
        enqueueSnackbar(`Le compte de l'administrateur bien été enregistré !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }

  const adminInputs = [
    {
      name: 'lastname',
      label: 'Nom',
      defaultValue: _.get(admin, 'lastname'),
      validation: { required: 'Champs requis' }
    },
    {
      name: 'firstname',
      label: 'Prénom',
      defaultValue: _.get(admin, 'firstname'),
      validation: { required: 'Champs requis' }
    },
    {
      name: 'email',
      label: 'Email',
      defaultValue: _.get(admin, 'email'),
      validation: { required: 'Champs requis', validate: validator.validateEmail }
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
              {_passwordVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>,
      validation: {required: 'Champs requis', validate: validator.validatePassword}
    },
    {
      name:'password_confirmation',
      label:'Confirmation mot de passe',
      type: _passwordVisible ? 'text' : 'password',
      combinedValdation: (values) => values.password === values.password_confirmation || "Les mots de passe ne se correspondent pas",
      validation: {required: 'Champs requis'}
    }
  ]

  return (
    <div className='AdminForm w500'>
      <Form title={admin ?"Modifier administrateur" : "Nouvel administrateur"}
        inputs={adminInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={adminRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default AdminForm;