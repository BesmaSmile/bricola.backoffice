import React from 'react';
import Form from 'components/misc/Form/Form';
import { hooks } from 'functions/hooks';
import { useSnackbar } from 'notistack';
import { permissionConstants } from 'consts';

import _ from 'lodash';

const PermissionsForm = props => {
  const { close, updateAdminPermissions, permissions } = props
  const updateAdminPermissionsRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = values => {
    const toSend = _.pickBy(values, value=>value===true);
    updateAdminPermissionsRequest.execute({
      action: () => updateAdminPermissions(values),
      success: (res) => {
        enqueueSnackbar(`Les permissions on bien été attribuées à l'administrateur !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }

  const permissionsInputs = {
    [permissionConstants.DASHBOARD]:'Tableau de bord',
    [permissionConstants.ORDERS]: 'Commandes',
    [permissionConstants.COMMISSIONS]: 'Commissions',
    [permissionConstants.RECLAMATIONS]: 'Réclamations',
    [permissionConstants.COMPANIES]: 'Entreprise',
    [permissionConstants.PARTNERS]: 'Partenaires',
    [permissionConstants.CLIENTS]: 'Clients',
    [permissionConstants.PAYMENT]: 'Paiement',
    [permissionConstants.PROMO_CODES]: 'Codes promo',
    [permissionConstants.SERVICES]: 'Services',
    [permissionConstants.PUBLICATIONS]: 'Publications',
    [permissionConstants.ADMINS]: 'Administrateurs',
  }

  let formInputs = Object.keys(permissionsInputs).map(key=>({
      name : key,
      label : permissionsInputs[key],
      type : 'check',
      defaultValue : _.get(permissions, key, false)
    })
  )
  return (
    <div className='PermissionsForm w550'>
      <Form title="Permissions administrateur"
        inputs={formInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={updateAdminPermissionsRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default PermissionsForm;