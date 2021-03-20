import React from 'react';
import Form from 'components/misc/Form/Form';
import { hooks, validator } from 'functions';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

const PaymentForm = props => {
  const { close, addPayment, payer, toPay } = props
  const addPaymentRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = values => {
  
    addPaymentRequest.execute({
      action: () => addPayment({...values,...payer}),
      success: (res) => {
        enqueueSnackbar(`Les informations de paiement ont bien été enregistrées !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }



  const paymentsInputs = [
    {
      content: (values) => <div className='flex row jcsb'>
        <span>Reste à payer </span>
        <span className='fs25 bold cgreen'>{(toPay - parseInt(values.amount || 0))?.toFixed(2)} <span className='fs14'>DA</span></span>
      </div>
    },
    {
      name: 'amount',
      label: 'Montant',
      type: 'number',
      validation: { required: 'Champs requis', validate: (val) => validator.validateMax(val, toPay) }
    },
    {
      name: 'method',
      label: 'Méthode de paiement',
      type: 'select',
      validation: { required: 'Champs requis' },
      options : ()=> [
        {value : 'ccp', name: 'CCP'}, 
        {value : 'cash', name: 'Cash'},
        {value : 'bank_virement', name: 'Virement Bancaire'},
      ]
    },
  ]

  
  return (
    <div className='PaymentForm w500'>
      <Form title={"Paiement"}
        inputs={paymentsInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={addPaymentRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default PaymentForm;