import React from 'react';
import BusinessIcon from '@material-ui/icons/BusinessRounded';
import PersonIcon from '@material-ui/icons/PersonRounded';
import TableList from 'components/misc/TableList/TableList';
import { format } from 'date-fns';
import _ from 'lodash';
import './Payments.scss';

const paymentSources = [
  { value: 'all', name: 'Tout' },
  { value: 'partner', name: 'Partenaire' },
  { value: 'company', name: 'Entreprise' },
]

const paymentMethods = [
  { value: 'all', name: 'Tout' },
  { value: 'ccp', name: 'CCP' },
  { value: 'cash', name: 'Cash' },
  { value: 'bank_virement', name: 'Virement Bancaire' },
]

const PaymentsList = (props) => {

  const columns = [
    { key: 'from', name: '' },
    { key: 'origin', name: 'Partenaire/Entreprise' },
    { key: 'createdAt', name: 'Créé le' },
    { key: 'by', name: 'Créé par' },
    { key: 'amount', name: 'Montant' },
    { key: 'method', name: 'Méthode de paiement' },
    //{ key: 'options', name: 'Options' }
  ]
  const filters = [
    { key: 'from', name: 'Effectué par', type: 'select', value: 'all', fields: ['from'], options: paymentSources },
    { key: 'method', name: 'Méthode de paiement', type: 'select', value: 'all', fields: ['method'], options: paymentMethods },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash', '').substring(1), fields: ['origin.name', 'origin.contact', 'createdAt', 'by.name', 'by.email'] }
  ]

  const rows = _.get(props, 'payments', []).map(payment => {
    const originName = payment.from ==='partner' ? `${payment.partner.firstname} ${payment.partner.lastname}`: payment.company.name
    const originContact = payment.from ==='partner' ? payment.partner.phoneNumber : ''
    const admin = payment.logging.actions[0].by;
    return {
      from: {
        value: payment.from,
        render: <div className='pmt-paymentCell'>
          {payment.from === 'partner' ?
            <PersonIcon fontSize="small" />
            
            : <BusinessIcon fontSize="small" />
          }
        </div>
      },
      origin: {
        name: { value: originName},
        contact: { value: originContact },
        render: <div className='pmt-paymentCell'>
            <div>{originName}</div>
            <div className='pmt-smallText'>{originContact}</div>
        </div>
      },
      createdAt: { value: format(new Date(payment.createdAt), 'dd/MM/yyyy'), render: <div className='pmt-smallText'>{format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm')}</div> },
      by: {
        name: { value: `${admin.firstname} ${admin.lastname}` },
        email: { value: admin.email },
        render: <div className='pmt-paymentCell'>
            <div>{admin.firstname} {admin.lastname}</div>
            <div className='pmt-smallText'>{admin.email}</div>
        </div>,
      },
      amount: { value: payment.amount, render: <div className='pmt-paymentCell'>{payment.amount} DA</div> },
      method: { value: payment.method, render: <div className='pmt-paymentCell'>{paymentMethods.find(method=>method.value === payment.method).name}</div>}
      /*options: {
        render:

          <div className='flex row'>
            {payment.reclamation ?
              <Link to={{ pathname: '/reclamations', hash: payment._id }}>
                <IconButton>
                  <PostAddIcon fontSize="small" />
                </IconButton>
              </Link> :
              <Tooltip title="Ajouter réclamation" placement="top">
                <IconButton
                  onClick={() => openPaymentForm(payment)}>
                  <PostAddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
            <Tooltip title="Ouvrir la commande" placement="top">
              <IconButton
                onClick={() => openPaymentDetails(payment)}>
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
      }*/
    }
  })

  return (
    <div className='pmt-PaymentsList brad15 bwhite'>
      <TableList title='Paiements'
        subTitle={`${_.get(props, 'payments.length', '--')} paiement(s)`}
        columns={columns}
        rows={rows}
        filters={filters}
        withRefresh={true}
        sum={{ key:'amount', render: (sum) => <div className='flex row aic fs20 cgrey extralight'>Total des commissions payées <span className='pmt-total bold fs35 cstrongblue'>{sum}</span> DA</div>}}
        onRefresh={props.reload}
        loading={props.loading}
        error={props.error} 
      />
    </div>
  )
}

export default PaymentsList;