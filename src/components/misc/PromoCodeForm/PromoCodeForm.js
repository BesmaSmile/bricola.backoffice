import React, { useState } from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Form from 'components/misc/Form/Form';
import { hooks } from 'functions/hooks';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import './PromoCodeForm.scss'

const PromoCodeForm = props => {
  const { close, addPromoCode, services } = props
  const promoCodeRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();
  const [_selectedServices, _setSelectedServices] = useState([]);
  const [_servicesSelectionError,  _setServicesSelectionError] = useState(false)

  
  const toggleService = (id) => {
    let selectedServices = Object.assign([], _selectedServices)
    if (_selectedServices.some(s => s === id))
      selectedServices = selectedServices.filter(s => s !== id)
    else selectedServices = [...selectedServices, id ];
    _setSelectedServices(selectedServices)
    _setServicesSelectionError(selectedServices.length === 0)
  }

  const onSubmit = values => {
    if(_selectedServices.length === 0){
      _setServicesSelectionError(true)
      return
    }
    const toSend = { ...values, services: _selectedServices };
    promoCodeRequest.execute({
      action: () => addPromoCode(toSend),
      success: (res) => {
        enqueueSnackbar(`Les informations du code promo ont bien été enregistrées !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }

  const promoCodeInputs = [
    {
      name: 'name',
      label: 'Nom',
      validation: { required: 'Champs requis' }
    },
    {
      name: 'quantity',
      label: 'Quantité',
      type: 'number',
      validation: { required: 'Champs requis' }
    },
    {
      name: 'reduction',
      label: 'Réduction',
      type: 'number',
      validation: { required: 'Champs requis' }
    },
    {
      name: 'unity',
      label: 'Unité',
      type: 'select',
      validation: { required: 'Champs requis' },
      options : ()=> [{value : 'percentage', name: 'Pourcentage (%)'}, {value : 'amount', name: 'Somme (DA)'}]
    },
    {
      content: () =>
        <div witherror={_servicesSelectionError ? 'true' : 'false'}>
          <div className='fs14 cstronggrey marb5'>Sélectionner les services</div>
          <div className='frm-error fs12 marl3 mart5 cred light marb10'>{_servicesSelectionError && "Sélectionner au minimum un service !"}</div>
          <div className='flex fww'>
            {
              services.map(service =>
                <div className='marr10 marb10' key={service._id}>
                  <ToggleButton onClick={() => toggleService(service._id)} classes={{ root: 'pcf-toggleButton' }} selected={_selectedServices.some(s => s === service._id)}>{service.name}</ToggleButton>
                </div>
              )
            }
          </div>
        </div>
    }
  ]

  
  return (
    <div className='PromoCodeForm w500'>
      <Form title={"Nouveau code promo"}
        inputs={promoCodeInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={promoCodeRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default PromoCodeForm;