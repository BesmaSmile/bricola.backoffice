import React, { useState } from 'react';
import Form from 'components/misc/Form/Form';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { hooks } from 'functions/hooks';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import './CompanyForm.scss'

const CompanyForm = props => {
  const { close, company, updateCompany, addCompany, services } = props
  const companyRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();
  const companyServices = _.get(company, 'providedServices', [])
  const [_selectedServices, _setSelectedServices] = useState(companyServices)
  const [_servicesSelectionError,  _setServicesSelectionError] = useState(false)

  const onSubmit = values => {
    if(_selectedServices.length === 0){
      _setServicesSelectionError(true)
      return
    } 
    const toSend = {
      name: values.name,
      providedServices: _selectedServices.map((service, i) => {
        const commission = values.providedServices[i].commission
        return {
          ...service,
          commission: commission.deplacement
            ? {
              global: parseInt(commission.global),
              deplacement: parseInt(commission.deplacement)
            }
            : {
              global: parseInt(commission.global)
            }
        }
      })
    }
    companyRequest.execute({
      action: () => company ? updateCompany(company._id, toSend) : addCompany(toSend),
      success: (res) => {
        enqueueSnackbar(`Les informations de l'entreprise ont bien été enregistrées !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }

  const toggleService = (id) => {
    let selectedServices = Object.assign([], _selectedServices)
    if (_selectedServices.some(s => s.service === id))
      selectedServices = selectedServices.filter(s => s.service !== id)
    else selectedServices = [...selectedServices, { service: id }]
    _setSelectedServices(selectedServices)
    _setServicesSelectionError(selectedServices.length === 0)
  }

  const companyInputs = [
    {
      name: 'name',
      label: 'Nom',
      defaultValue: _.get(company, 'name'),
      validation: { required: 'Champs requis' }
    },
    {
      content: () =>
        <div witherror={_servicesSelectionError ? 'true' : 'false'}>
          <div className='fs14 cstronggrey marb5'>Sélectionner les services du partenaire...</div>
          <div className='frm-error fs12 marl3 mart5 cred light marb10'>{_servicesSelectionError && "Sélectionner au minimum un service !"}</div>
          <div className='flex fww'>
            {
              services.map(service =>
                <div className='marr10 marb10' key={service._id}>
                  <ToggleButton onClick={() => toggleService(service._id)} classes={{ root: 'cf-toggleButton' }} selected={_selectedServices.some(s => s.service === service._id)}>{service.name}</ToggleButton>
                </div>
              )
            }
          </div>
        </div>
    },
  ]

  _selectedServices.forEach((s, i) => {
    const service = services.find(service => service._id === s.service)
    const commissionInputs = [
      { content: () => <div className='marb10 mart20'> Commission du service <span className='medium'>{service.name}</span></div> },
      [
        {
          name: `providedServices.${i}.commission.global`,
          label: 'Prix global/main d\'oeuvre',
          type: 'number',
          defaultValue: _.get(s, 'commission.global'),
          endAdornment: <span className='medium'>%</span>,
          validation: { required: 'Champs requis' }
        }, 
        ...( service.category !== 'Transport' ? [{
          name: `providedServices.${i}.commission.deplacement`,
          label: 'Déplacement/diagnostic',
          type: 'number',
          endAdornment: <span className='medium'>DA</span>,
          defaultValue: _.get(s, 'commission.deplacement'),
          validation: { required: 'Champs requis' }
        }] : []),
      ]
    ]
    companyInputs.push(...commissionInputs);
  });

  return (
    <div className='CompanyForm w500'>
      <Form title={company ? "Modifier informations entreprise" : "Nouvelle entreprise"}
        inputs={companyInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={companyRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default CompanyForm;