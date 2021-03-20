import React, {useState} from 'react';
import Form from 'components/misc/Form/Form';
import { hooks } from 'functions/hooks';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

const ReclamationForm = props => {
  const { close, order, addReclamation } = props
  const reclamationRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = values => {
    reclamationRequest.execute({
      action: () => addReclamation( order._id,values.comment),
      success: (res) => {
        enqueueSnackbar(`La réclamation à bien été enregistrée !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }

  const reclamationInputs = [
    {
      name: 'client',
      label: 'Client',
      disabled :true,
      defaultValue :`${ _.get(order, 'client.firstname')} ${ _.get(order, 'client.lastname')}`,
      validation: { required: 'Champs requis' }
    },
    {
      name: 'partner',
      label: 'Partenaire',
      disabled: true,
      defaultValue :`${ _.get(order, 'partner.firstname')} ${ _.get(order, 'partner.lastname')}`,      
      validation: { required: 'Champs requis' }
    },
    {
      name: 'comment',
      label: 'Commentaire',
      validation: { required: 'Champs requis' },
      multiline :true,
      rows : 4
    },
  ]

  return (
    <div className='ReclamationForm w500'>
      <Form title={"Nouvelle réclamation"}
        inputs={reclamationInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={reclamationRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default ReclamationForm;