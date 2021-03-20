import React from 'react';
import TableList from 'components/misc/TableList/TableList';
import PromoCodeForm from 'components/misc/PromoCodeForm/PromoCodeForm';
import Status from 'components/misc/Status/Status';
import { useDialog } from 'components/misc/Dialog/Dialog';
import { format } from 'date-fns';
import _ from 'lodash';
import './PromoCodes.scss';

const promoCodeStatus = [
  { value: 'all', name: 'Tout' },
  { value: 'valid', name: 'Valide' },
  { value: 'expired', name: 'Expiré' }
]

const unities = {
  percentage: '%',
  amount: 'DA'
}

const PromoCodesList = (props) => {

  const dialog = useDialog()
  const columns = [
    { key: 'name', name: 'Nom' },
    { key: 'createdAt', name: 'Créé le' },
    { key: 'by', name: 'Créé par' },
    { key: 'services', name: 'Services' },
    { key: 'reduction', name: "Réduction" },
    { key: 'quantity', name: 'Quantité' },
    { key: 'consumed', name: "Consommé" },
    { key: 'status', name: 'Statut' },

  ]
  const filters = [
    { key: 'status', name: 'Statut', type: 'select', value: 'all', fields: ['status'], options: promoCodeStatus },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash', '').substring(1), fields: ['name', 'createdAt', 'by.firstname', 'by.lastname', 'by.email', 'services'] }
  ]

  const openPromoCodeForm = () => {
    const promoCodeForm = <PromoCodeForm
      services={props.services}
      close={dialog.close}
      addPromoCode={props.addPromoCode} />
    dialog.open(promoCodeForm)
  }

  const rows = _.get(props, 'promoCodes', []).map(promoCode => {
    const status = promoCode.quantity === promoCode.consumed ? 'expired' : 'valid';
    const createdBy = _.get(promoCode, 'logging.actions.0.by', {})
    const serviceNames = _.get(promoCode, 'services', [])
      .map((service) => props.services.find(s=>s._id === service)?.name).join(', ');
    return {
      name: { value: promoCode.name, render: <div className='pc-promoCodeCell'>{promoCode.name}</div> },
      createdAt: { value: format(new Date(promoCode.createdAt), 'dd/MM/yyyy'), render: <div className='pc-smallCell'>{format(new Date(promoCode.createdAt), 'dd/MM/yyyy')}</div> },
      by: {
        firstname: { value: createdBy.firstname },
        lastname: { value: createdBy.lastname },
        email: { value: createdBy.email },
        render: <div>
          <div className='pc-promoCodeCell'>{createdBy.firstname} {createdBy.lastname}</div>
          <div className='pc-smallCell'>{createdBy.email}</div>
        </div>
      },
      services: { value: serviceNames, render: <div  className='pc-smallCell'>{serviceNames}</div> },
      quantity: { value: promoCode.quantity, render: <div className='pc-promoCodeCell'>{promoCode.quantity}</div> },
      reduction: { value: promoCode.reduction, render: <div className='pc-promoCodeCell'>{promoCode.reduction} {unities[promoCode.unity]}</div> },
      consumed: { value: promoCode.consumed, render: <div className='pc-promoCodeCell'>{promoCode.consumed}</div> },
      status: {
        value: status,
        render: <Status value={status} />
      },
    }

  })

  return (
    <div className='pc-PromoCodesList brad15 bwhite'>
      <TableList title='Codes Promo'
        subTitle={`${_.get(props, 'promoCodes.length', '--')} code(s) promo`}
        columns={columns}
        rows={rows}
        filters={filters}
        withRefresh={true}
        withAddButton={true}
        onAddClick={() => openPromoCodeForm()}
        onRefresh={props.reload}
        loading={props.loading}
        error={props.error} />
    </div>
  )
}

export default PromoCodesList;