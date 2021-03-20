import React from 'react';
import TableList from 'components/misc/TableList/TableList';
import ServiceForm from 'components/misc/ServiceForm/ServiceForm';
import { IconButton, Tooltip } from '@material-ui/core';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { useDialog } from 'components/misc/Dialog/Dialog';
import { apiConstants, serviceCategories } from 'consts';
import logo from 'assets/img/logo.png';
import { format } from 'date-fns';
import _ from 'lodash';
import './Services.scss';

const categories = [{value: 'all', name: 'Tout'}, ...serviceCategories.map(category => ({value: category, name: category}))];

const ServicesList = (props) => {

  const dialog = useDialog()
  const columns = [
    { key: 'image', name: '' },
    { key: 'name', name: 'Nom' },
    { key: 'createdAt', name: 'Créé le' },
    { key: 'category', name: 'Catégorie' },
    { key: 'options', name: "Options" }
  ]
  const filters = [
    { key: 'category', name: 'Catégorie', type: 'select', value: 'all', fields: ['category'], options: categories },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash', '').substring(1), fields: ['name', 'createdAt'] }
  ]

  const openServiceForm = (service) => {
    const serviceForm = <ServiceForm
      service={service}
      close={dialog.close}
      updateService={props.updateService}
      addService={props.addService} />
    dialog.open(serviceForm)
  }

  const rows = _.get(props, 'services', []).map(service => {
    return {
      image: {
        render: <div className='flex row'>
          <img className='srv-smallImage marr10' src={service.image ? `${apiConstants.URL}/service/image/${service.image}` : logo} alt="" />
          <div className='srv-smallIcon'><img src={service.icon ? `${apiConstants.URL}/service/image/${service.icon}` : logo} alt="" /></div>
        </div>
      },
      name: { value: service.name, render: <div className='srv-serviceCell'>{service.name}</div> },
      category: { value: service.category, render: <div className='srv-serviceCell'>{service.category}</div> },
      createdAt: { value: format(new Date(service.createdAt), 'dd/MM/yyyy'), render: <div className='srv-dateCell'>{format(new Date(service.createdAt), 'dd/MM/yyyy')}</div> },
      options: {
        render:
          <div className='flex row'>
            <Tooltip title="Modifier" placement="top">
              <IconButton
                onClick={() => openServiceForm(service)}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
      }
    }

  })

  return (
    <div className='srv-ServicesList brad15 bwhite'>
      <TableList title='Services'
        subTitle={`${_.get(props, 'services.length', '--')} service(s)`}
        columns={columns}
        rows={rows}
        filters={filters}
        withRefresh={true}
        withAddButton={true}
        onAddClick={() => openServiceForm()}
        onRefresh={props.reload}
        loading={props.loading}
        error={props.error} />
    </div>
  )
}

export default ServicesList;