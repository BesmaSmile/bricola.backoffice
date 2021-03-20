import React from 'react';
import SvgIcon from 'components/misc/SvgIcon/SvgIcon';
import TableList from 'components/misc/TableList/TableList';
import PartnerForm from 'components/misc/PartnerForm/PartnerForm';
import PaymentForm from 'components/misc/PaymentForm/PaymentForm';
import DisablingCommentForm from 'components/misc/DisablingCommentForm/DisablingCommentForm';
import Status from 'components/misc/Status/Status';
import LoggingView from 'components/misc/LoggingView/LoggingView';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/AssignmentRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import PaymentIcon from '@material-ui/icons/PaymentRounded';
import { Link } from "react-router-dom";
import { useDialog } from 'components/misc/Dialog/Dialog';
import { useSnackbar } from 'notistack';
import { hooks } from 'functions';
import { format, isBefore, differenceInCalendarMonths } from 'date-fns';
import _ from 'lodash';
import './Partners.scss';

const partnerStatus = [
  { value: 'all', name: 'Tout' },
  { value: 'enabled', name: 'Activé' },
  { value: 'disabled', name: 'Désactivé' },
  { value: 'suspended', name: 'Suspendu' },
]

const partnerTypes = [
  { value: 'all', name: 'Tout' },
  { value: 'particular', name: 'Particulier' },
  { value: 'B2B', name: 'B2B' }
]

const PartnerActions = props => {
  const { partner, updatePartnerStatus } = props
  const { enqueueSnackbar } = useSnackbar();
  const dialog = useDialog()
  const updatePartnerStatusRequest = hooks.useRequest()

  const toggleAccount = (comment = '') => {
    const status = { state: _.get(partner, 'status.state') === 'disabled' ||  _.get(partner, 'status.state') === 'suspended' ? 'enabled' : 'disabled', comment }
    updatePartnerStatusRequest.execute({
      action: () => updatePartnerStatus(partner._id, status),
      success: () =>  enqueueSnackbar(`Le compte du partenaire a bien été ${status.state === 'enabled' ? 'activé' : 'désactivé'} !`, { variant: 'success' }),
      failure: (error) => enqueueSnackbar(error, { variant: 'error' }),
    })
  }

  const handleClick = () => {
    if (_.get(partner, 'status.state') === 'enabled') {
      dialog.openConfirmation({
        title: "Désactiver le compte du partenaire",
        message: "Voulez vous désactiver le compte d'un partenaire ?",
        yesText: "Oui",
        noText: "Non"
      }).then(() => {
        const disablingCommentForm = <DisablingCommentForm
          title="Désactiver le compte du partenaire"
          onSubmit={({comment}) =>{ dialog.close(); toggleAccount(comment); }}
          close={dialog.close} />
        dialog.open(disablingCommentForm)
      }).catch(error => console.log("rejected"))


    }
    else toggleAccount()
  }
  return (
    /*<ButtonWrapper 
      neededPermission={permissionConstants.TOGGLE_partner_ACCOUNT}
    button={(disabled)=>*/
    <Button
      disabled={/*disabled || */updatePartnerStatusRequest.pending}
      variant="outlined"
      size="small"
      classes={{ root: _.get(partner, 'status.state') === 'enabled' ? 'ptn-disableButton' : 'ptn-enableButton' }}
      onClick={handleClick}>
      {_.get(partner, 'status.state') === 'enabled' ? 'Désactiver' : 'Activer'}
    </Button>
    /*}
    />*/

  )
}

const PartnersList = (props) => {

  const dialog = useDialog()
  const columns = [
    { key: 'lastname', name: 'Nom' },
    { key: 'firstname', name: 'Prénom' },
    { key: 'createdAt', name: 'Créé le' },
    { key: 'coordinates', name: 'Coordonnées' },
    { key: 'type', name: 'Type' },
    { key: 'company', name: 'Entreprise' },
    { key: 'province', name: 'Wilaya' },
    { key: 'orders', name: 'Commandes' },
    
    { key: 'lastPayment', name: 'Dernier paiement' },
    { key: 'status', name: 'Statut' },
    { key: 'actions', name: 'actions' },
    { key: 'options', name: "Options" }
  ]
  const filters = [
    { key: 'status', name: 'Type', type: 'select', value: 'all', fields: ['type'], options: partnerTypes },
    { key: 'status', name: 'Statut', type: 'select', value: 'all', fields: ['status'], options: partnerStatus },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash', '').substring(1), fields: ['lastname', 'firstname', 'coordinates.phoneNumber', 'coordinates.email', 'province', 'createdAt', 'company'] }
  ]

  const openPartnerForm = (partner) => {
    const partnerForm = <PartnerForm
      provinces={props.provinces}
      companies={props.companies}
      services={props.services}
      partner={partner}
      close={dialog.close}
      addPartner={props.addPartner}
      updatePartner={props.updatePartner} />
    dialog.open(partnerForm)
  }

  const openPaymentForm = (partner) => {
    const paymentForm = <PaymentForm
      payer={{partner: partner._id}}
      toPay={partner.toPay?.toFixed(2)}
      close={dialog.close}
      addPayment={props.addPayment}
    />
    dialog.open(paymentForm)
  }

  const openLoggingView = (loggingId) => {
    const loggingView =<LoggingView id={loggingId} creatonTitle='Création du compte' />
    dialog.open(loggingView)
  }

  const isPaymentLate = (partner) => {
      const lastOperationDate = new Date(partner.lastPayment?.createdAt || partner?.createdAt);
      const today = new Date();
      const differenceInMonths = differenceInCalendarMonths(today, lastOperationDate);
      const firstDayOnTheMonth = new Date(today.setDate(1));
      firstDayOnTheMonth.setHours(0, 0, 0, 0);

      return partner.toPay > 0 &&  // un partenaire qui a un montant à payer >0
      // un partenaire qui n'a jamais payé ou son dernier paiement était fait avant le 1 er du mois courrant, avec la date courrante > 11 du mois 
      (( (!partner.lastPayment || isBefore( lastOperationDate, firstDayOnTheMonth)) &&  today.getDate() >=11)
      // un partenaire qui n'a pas payé depuis plus d'un mois (ou a été créé depuis plus d'un mois s'il n'a jamais fait de paiement)
      || (differenceInMonths>1))
  }

  const rows = _.get(props, 'partners', []).map(partner => {
    const isLate = isPaymentLate(partner);
    return {
      color: isLate && '#ff48001e',
      lastname: { value: partner.lastname, render: <div className='ptn-partnerCell'>{partner.lastname}</div> },
      firstname: { value: partner.firstname, render: <div className='ptn-partnerCell'>{partner.firstname}</div> },
      createdAt: { value: format(new Date(partner.createdAt), 'dd/MM/yyyy'), render: <div className='ptn-smallCell'>{format(new Date(partner.createdAt), 'dd/MM/yyyy')}</div> },
      coordinates: {
        phoneNumber: { value: partner.phoneNumber },
        email: { value: partner.email },
        render: <div>
          <div className='ptn-smallCell'>{partner.email}</div>
          <div className='ptn-smallCell'>{partner.phoneNumber}</div>
        </div>,
      },
      type: {
        value: partner.type,
        render: <div className='ptn-smallCell'>{partnerTypes.find(t => t.value === partner.type)?.name}</div>
      },
      company: {
        value: partner.company?.name,
        render: partner.company && <Link to={{ pathname: '/companies', hash: partner.company.name }}>
          <span>{partner.company.name}</span>
        </Link>
      },
      province: {
        value: _.get(partner, 'province.name'),
        render: <div className='ptn-detailContainer'>
          <div className='ptn-datailTop'><SvgIcon name='mapLocation' color={_.get(partner, 'province.name') ? 'var(--green)' : 'var(--lightgrey)'} /></div>
          <div className='ptn-partnerCell'> {_.get(partner, 'province.name')} </div>
        </div>
      },
      orders: {
        value: partner.ordersCount,
        render: partner.ordersCount > 0 && <Link to={{ pathname: '/orders', hash: partner.phoneNumber }}>
          <div className='fs18 lh25 bold txtac'>{partner.ordersCount}</div>
        </Link>
      },
      commissions: {
        render:
          partner.type === 'particular' && <Link to={{ pathname: '/orders', hash: partner.name }}>
            <div className='lh25 txtac'>{partner.totalCommissions} DA</div>
          </Link>
      },
      paid: {
        render:
          partner.type === 'particular' && <Link to={{ pathname: '/payment', hash: partner.name }}>
            <div className='lh25 txtac cgreen'>{partner.totalPayments} DA</div>
          </Link>
      },
      toPay: {
        value: partner.type === 'particular' ? partner.toPay : 0,
        render: partner.type === 'particular' && <div className='fs18 lh25 bold txtac corange'>{partner.toPay?.toFixed(2)} <span className='fs14'>DA</span></div>       
      },
      lastPayment: {
        render: partner.lastPayment && <div className={`ptn-smallCell ${isLate ? 'ptn-lateText' : ''}`}>{format(new Date(partner.lastPayment?.createdAt), 'dd/MM/yyyy')}</div>
      },
      status: {
        value: _.get(partner, 'status.state'),
        render: <Status value={_.get(partner, 'status.state')} comment={_.get(partner, 'status.comment')}/>
      },
      actions: {
        render: <PartnerActions partner={partner} updatePartnerStatus={props.updatePartnerStatus} />
      },
      options: {
        render:
          <div className='flex row'>
            <Tooltip title="Modifier" placement="top">
              <IconButton
                onClick={() => openPartnerForm(partner)}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Effectuer paiement" placement="top">
              <IconButton disabled={partner.type === 'B2B'} onClick={() => openPaymentForm(partner)}>
                <PaymentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Historique" placement="top">
              <IconButton
                disabled={!partner.logging}
                onClick={() => openLoggingView(partner.logging)}>
                <AssignmentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
      }
    }

  })

  return (
    <div className='ptn-PartnersList brad15 bwhite'>
      <TableList title='Partenaires'
        subTitle={`${_.get(props, 'partners.length', '--')} partenaire(s)`}
        columns={columns}
        rows={rows}
        filters={filters}
        withRefresh={true}
        withAddButton={true}
        onAddClick={() => openPartnerForm()}
        onRefresh={props.reload}
        sum={{ key:'toPay', render: (sum) => props.commissionPermission && <div className='flex row aic fs20 cgrey extralight'>Total des commissions non payées <span className='ptn-total bold fs35 cstrongblue'>{sum}</span> DA</div>}}
        loading={props.loading}
        error={props.error} />
    </div>
  )
}

export default PartnersList;