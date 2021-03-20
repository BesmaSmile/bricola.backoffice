import React, { useState } from 'react';
import Form from 'components/misc/Form/Form';
import { hooks } from 'functions/hooks';
import { useSnackbar } from 'notistack';
import { IconButton, Tooltip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/ClearRounded';
import AddIcon from '@material-ui/icons/AddRounded';
import ImageIcon from '@material-ui/icons/ImageRounded';
import ImageUploader from 'components/misc/ImageUploader/ImageUploader';
import KeywordsForm from 'components/misc/KeywordsForm/KeywordsForm';

import { apiConstants, serviceCategories } from 'consts'
import _ from 'lodash';
import './ServiceForm.scss'

const ServiceForm = props => {
  const { close, service, updateService, addService } = props
  const [_keywords, _setKeywords]=useState(_.get(service, 'keywords', []));
  const [_timeslots, _setTimeslots] = useState(_.get(service, 'prices.timeslotPrices', []).length >0 ? service.prices.timeslotPrices : [{}])
  const [_image, _setImage] = useState({ raw: "", preview: _.get(service, 'image') ? `${apiConstants.URL}/service/image/${service.image}` : '' });
  const [_icon, _setIcon] = useState({ raw: "", preview: _.get(service, 'icon') ? `${apiConstants.URL}/service/image/${service.icon}` : '' });
  const serviceRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = values => {
    const toSend = {service : {...values, keywords: _keywords}, image : _image.raw, icon: _icon.raw}

    serviceRequest.execute({
      action: () => service ? updateService(service._id, toSend) : addService(toSend),
      success: (res) => {
        enqueueSnackbar(`Les informations du service ont bien été enregistrées !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }

  const addTimslot = () => {
    _setTimeslots([..._timeslots, {}])
  }

  const deleteTimeslot = (index) => {
    let timeslots = Object.assign([], _timeslots)
    timeslots = timeslots.filter((t, i) => i !== index)
    _setTimeslots(timeslots)
  }
  const serviceInputs = [
    [
      {
        content: ()=>
          <div className='flex row aife mart10 marb20'>
            <div className='sf-imgContainer  w150 h150 marr20'>
              <ImageUploader
                image={_image}
                updateImage={_setImage}
                preview={(image) => <img className='sf-image' src={image} alt='' />}
                pending={serviceRequest.pending}
                emptyPreview={() =>
                  <div className='relw100 relh100 flex aic jcc cgrey'>
                    <ImageIcon classes={{ root: 'sf-imgIcon' }} />
                  </div>}
              />
            </div>

            <div className='sf-iconContainer w50 h50'>
              <ImageUploader
                image={_icon}
                updateImage={_setIcon}
                preview={(icon) => <img className='sf-icon' src={icon} alt='' />}
                pending={serviceRequest.pending}
                emptyPreview={() =>
                  <div className='relw100 relh100 flex aic jcc cgrey'>
                    <ImageIcon classes={{ root: 'sf-imgIcon' }} />
                  </div>}
              />
            </div>
          </div>
      }
    ],
    [{
      name: 'name',
      label: 'Nom',
      defaultValue: _.get(service, 'name'),
      validation: { required: 'Champs requis' }
    }],
    [{
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      defaultValue: _.get(service, 'category'),
      validation: { required: 'Champs requis' },
      options: () => serviceCategories.map(option => ({ value: option, name: option }))
    },
    {
      name: 'placement',
      label: 'Placement',
      type: 'number',
      defaultValue: _.get(service, 'placement'),
      validation: { required: 'Champs requis' },
    }],
    {
      name: 'description',
      label: 'Descriptions',
      defaultValue: _.get(service, 'description'),
      validation: { required: 'Champs requis' },
      multiline: true,
      rows: 2
    },
    {
      content :()=> <KeywordsForm keywords={_keywords} updateKeywords={_setKeywords} />
    },
    /* {
      name: 'keywords.0',
      label: 'Mots clés',
      defaultValue: _.get(service, 'description'),
      validation: { required: 'Champs requis' }
    }, */
    {
      name: 'params.withDestination',
      label: 'Le client doit introduire une destination',
      type: 'switch',
      defaultValue: _.get(service, 'params.withDestination')
    },
    {
      name: 'params.withDescription',
      label: 'Le client peut ajouter une description de son besoin',
      type: 'switch',
      defaultValue: _.get(service, 'params.withDescription')
    },
    {
      content: ()=><div className='flex jcsb row aic medium marb20 mart30'>
        Prix kilometrage ou déplacement/diagnostic
        <Tooltip title="Ajouter intervalle" placement="top">
          <IconButton size="small" onClick={addTimslot}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
    },
    ..._timeslots.map((timeslot, i) => (
      [{
        name: `prices.timeslotPrices.${i}.from`,
        label: 'De',
        type: 'time',
        shrink: true,
        placeholder: '08:00',
        defaultValue: _.get(timeslot, 'from'),
        watch: i > 0 && `prices.timeslotPrices.${i-1}.to`,
        validation: { required: 'Champs requis' }
      },
      {
        name: `prices.timeslotPrices.${i}.to`,
        label: 'À',
        type: 'time',
        shrink: true,
        placeholder: '12:00',
        defaultValue: _.get(timeslot, 'to'),
        validation: { required: 'Champs requis' }
      },
      {
        name: `prices.timeslotPrices.${i}.price`,
        label: 'Prix',
        shrink: true,
        placeholder: '250',
        type: 'number',
        defaultValue: _.get(timeslot, 'price'),
        endAdornment: <span className='fs14 cgrey medium'>DA</span>,
        validation: { required: 'Champs requis' }
      },
      {
        content:()=> <Tooltip title="Supprimer intervalle" placement="top">
          <IconButton size="small" onClick={() => deleteTimeslot(i)}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      }]
    )),
    {
      content: (values)=> values.category === 'Transport' && <div className='medium marb20 mart30'>Autres prix</div>
    },
    [{
      name: 'prices.loadingPrice',
      label: 'Prix de chargement',
      type: 'number',
      shrink: true,
      placeholder: '250',
      defaultValue: _.get(service, 'prices.loadingPrice'),
      watch: 'category',
      hidden: watchedValue => watchedValue !== 'Transport',
      endAdornment: <span className='fs14 cgrey medium'>DA</span>
    },
    {
      name: 'prices.unloadingPrice',
      label: 'Prix de déchargement',
      type: 'number',
      shrink: true,
      placeholder: '250',
      defaultValue: _.get(service, 'prices.unloadingPrice'),
      watch: 'category',
      hidden: watchedValue => watchedValue !== 'Transport',
      endAdornment: <span className='fs14 cgrey medium'>DA</span>
    }],
    [{
      name: 'prices.assemblyPrice',
      label: 'Prix de montage',
      type: 'number',
      shrink: true,
      placeholder: '250',
      defaultValue: _.get(service, 'prices.assemblyPrice'),
      watch: 'category',
      hidden: watchedValue => watchedValue !== 'Transport',
      endAdornment: <span className='fs14 cgrey medium'>DA</span>
    },
    {
      name: 'prices.disassemblyPrice',
      label: 'Prix de démontage',
      type: 'number',
      shrink: true,
      placeholder: '250',
      defaultValue: _.get(service, 'prices.disassemblyPrice'),
      watch: 'category',
      hidden: watchedValue => watchedValue !== 'Transport',
      endAdornment: <span className='fs14 cgrey medium'>DA</span>
    }],
    {
      content: ()=><div className='medium marb20 mart30'>Commission sur le service</div>
    },
    [{
      name: 'commission.global',
      label: 'Commission globale',
      type: 'number',
      shrink: true,
      placeholder: '20',
      defaultValue: _.get(service, 'commission.global'),
      endAdornment: <span className='fs14 cgrey medium'>%</span>,
      validation: { required: 'Champs requis' }
    },
    {
      name: 'commission.deplacement',
      label: 'Commission déplacement',
      type: 'number',
      shrink: true,
      placeholder: '100',
      defaultValue: _.get(service, 'commission.deplacement'),
      endAdornment: <span className='fs14 cgrey medium'>DA</span>,
      watch: 'category',
      hidden: watchedValue => watchedValue === 'Transport',
    }],

  ]
  return (
    <div className='ServiceForm w500'>
      <Form title={service ? "Modifier informations service" : "Nouveau service"}
        inputs={serviceInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={serviceRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default ServiceForm;