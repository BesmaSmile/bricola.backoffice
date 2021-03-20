import React, { useState } from 'react';
import Form from 'components/misc/Form/Form';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/VisibilityRounded';
import VisibilityOff from '@material-ui/icons/VisibilityOffRounded';
import { hooks } from 'functions';
import { useSnackbar } from 'notistack';
import { validator } from 'functions';
import _ from 'lodash';
import './PartnerForm.scss'

const PartnerForm = props => {
  const { close, partner, updatePartner, addPartner, provinces, companies, services } = props
  const partnerRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();
  const partnerServices = _.get(partner, 'providedServices', []);
  const [_selectedServices, _setSelectedServices] = useState(partnerServices)
  const [_passwordVisible, _setPasswordVisible] = useState(false)
  const [_servicesSelectionError, _setServicesSelectionError] = useState(false)

  const handleClickShowPassword = () => {
    _setPasswordVisible(!_passwordVisible)
  }

  const onSubmit = values => {
    if (_selectedServices.length === 0) {
      _setServicesSelectionError(true)
      return
    }
    const toSend =  {
      ...values,
      providedServices: values.company
        ? values.providedServices.filter(providedService => includedService(values.company, providedService.service))
        :  values.providedServices
    }
    delete toSend.password_confirmation
    partnerRequest.execute({
      action: () => partner ? updatePartner(partner._id, toSend) : addPartner(toSend),
      success: (res) => {
        enqueueSnackbar(`Les informations du partenaire ont bien été enregistrées !`, { variant: 'success' })
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

  const includedService = (companyId, serviceId) => {
    return companies.find(company => company._id === companyId)
      .providedServices.some(providedService => providedService.service === serviceId)
  }

  const partnerInputs = [
    [{
      name: 'lastname',
      label: 'Nom',
      defaultValue: _.get(partner, 'lastname'),
      validation: { required: 'Champs requis' }
    },
    {
      name: 'firstname',
      label: 'Prénom',
      defaultValue: _.get(partner, 'firstname'),
      validation: { required: 'Champs requis' }
    }],
    {
      name: 'email',
      label: 'Email',
      shrink: true,
      placeholder: 'exemple@mail.com',
      defaultValue: _.get(partner, 'email'),
      validation: { required: 'Champs requis', validate: validator.validateEmail }
    },
    [{
      name: 'phoneNumber',
      label: 'Téléphone',
      placeholder : '+213555001100',
      defaultValue: _.get(partner, 'phoneNumber'),
      validation: { required: 'Champs requis' , validate: validator.validatePhone}
    },
    {
      name: 'province',
      label: 'Wilaya',
      type: 'select',
      defaultValue: _.get(partner, 'province._id'),
      validation: { required: 'Champs requis' },
      options: () => (provinces || []).sort((p1, p2) => p1.code - p2.code).map(province => ({ value: province._id, name: `${province.code < 10 ? '0' : ''}${province.code} - ${province.name}` }))
    }],
    [{
      name: 'type',
      label: 'Type',
      type: 'select',
      defaultValue: _.get(partner, 'type'),
      validation: { required: 'Champs requis' },
      options: () => [{ value: 'particular', name: 'Particulier' }, { value: 'B2B', name: 'B2B' }]
    },
    {
      name: 'company',
      label: 'Entreprise',
      type: 'select',
      defaultValue: _.get(partner, 'company._id'),
      watch: 'type',
      hidden: watchedValue => watchedValue === 'particular',
      validation: { required: 'Champs requis' },
      options: () => companies?.map(company => ({ value: company._id, name: company.name }))
    }],
    {
      content: (values) => {
        let selectedServices = Object.assign([], _selectedServices)
        if (values.company) {
          selectedServices = selectedServices.filter(providedService => includedService(values.company, providedService.service))
        }

        return (
          <div witherror={_servicesSelectionError ? 'true' : 'false'}>
            <div className='fs14 cstronggrey marb5'>Sélectionner les services du partenaire...</div>
            <div className='frm-error fs12 marl3 mart5 cred light marb10'>{_servicesSelectionError && "Sélectionner au minimum un service !"}</div>
            <div className='flex fww'>
              {
                services.map(service =>
                  <div className='marr10 marb10' key={service._id}>
                    <ToggleButton disabled={values.company && !includedService(values.company, service._id)} onClick={() => toggleService(service._id)} classes={{ root: 'pf-toggleButton' }} selected={selectedServices.some(s => s.service === service._id)}>{service.name}</ToggleButton>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    },
  ]

  _selectedServices.forEach((providedService, i) => {
    const isTransportService = services.find(s => s._id === providedService.service).category === 'Transport';
    partnerInputs.push(...[
      {
        content: () => isTransportService && <div className='fs14 cstronggrey mar10 bold'>Véhicule pour le service "{services.find(s => s._id === providedService.service).name}"</div>
      },
      {
        name: `providedServices.${i}.service`,
        label: 'Service Id',
        defaultValue: providedService.service,
        dontDisplay: true,
      }, ...(isTransportService ? [
        {
          name: `providedServices.${i}.vehicle.registration`,
          label: "N° d'immatriculation",
          defaultValue: _.get(partner, `providedServices.${i}.vehicle.registration`),
          validation: { required: 'Champs requis' },
        },
        [{
          name: `providedServices.${i}.vehicle.brand`,
          label: 'Marque',
          defaultValue: _.get(partner, `providedServices.${i}.vehicle.brand`),
          validation: { required: 'Champs requis' },
        },
        {
          name: `providedServices.${i}.vehicle.color`,
          label: 'Couleur',
          defaultValue: _.get(partner, `providedServices.${i}.vehicle.color`),
          validation: { required: 'Champs requis' },
        }]
      ] : [])
    ]);
  })
  if (!partner)
    partnerInputs.splice(2, 0, [{
      name: 'password',
      label: 'Mot de passe',
      type: _passwordVisible ? 'text' : 'password',
      endAdornment:
        <InputAdornment position="end">
          <IconButton
            edge="end"
            onClick={handleClickShowPassword}
          >
            {_passwordVisible ?  <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>,
      validation: { required: 'Champs requis', validate : validator.validatePassword }
    },
    {
      name: 'password_confirmation',
      label: 'Confirmation mot de passe',
      type: _passwordVisible ? 'text' : 'password',
      combinedValdation: (values) => values.password === values.password_confirmation  || "Les mots de passe ne se correspondent pas",
      validation: { required: 'Champs requis' }
    }])
  return (
    <div className='PartnerForm w600'>
      <Form title={partner ? "Modifier informations partenaire" : "Nouveau partenaire"}
        inputs={partnerInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={partnerRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default PartnerForm;