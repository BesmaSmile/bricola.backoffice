import React from 'react';
import TableList from 'components/misc/TableList/TableList';
import CompanyForm from 'components/misc/CompanyForm/CompanyForm';
import PaymentForm from 'components/misc/PaymentForm/PaymentForm';
import DisablingCommentForm from 'components/misc/DisablingCommentForm/DisablingCommentForm';
import Status from 'components/misc/Status/Status';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import LoggingView from 'components/misc/LoggingView/LoggingView';
import AssignmentIcon from '@material-ui/icons/AssignmentRounded';
import EditIcon from '@material-ui/icons/EditRounded';
import PaymentIcon from '@material-ui/icons/PaymentRounded';
import { Link } from "react-router-dom";
import { useDialog } from 'components/misc/Dialog/Dialog';
import { useSnackbar } from 'notistack';
import { hooks } from 'functions';
import { format } from 'date-fns';
import _ from 'lodash';
import './Companies.scss';

const companyStatus = [
  { value: 'all', name: 'Tout' },
  { value: 'enabled', name: 'Activé' },
  { value: 'disabled', name: 'Désactivé' }
]
const CompanyActions = props => {
  const { company, updateCompanyStatus } = props
  const { enqueueSnackbar } = useSnackbar();
  const dialog = useDialog()
  const updateCompanyStatusRequest = hooks.useRequest()

  const toggleCompany = (comment = '') => {
    const status = { state: _.get(company, 'status.state') === 'disabled' ? 'enabled' : 'disabled', comment }
    updateCompanyStatusRequest.execute({
      action: () => updateCompanyStatus(company._id, status),
      success: () => enqueueSnackbar(`L'entreprise a bien été ${status.state === 'enabled' ? 'activée' : 'désactivée'} !`, { variant: 'success' }),
      failure: (error) => enqueueSnackbar(error, { variant: 'error' }),
    })
  }

  const handleClick = () => {
    if (_.get(company, 'status.state') === 'enabled') {
      dialog.openConfirmation({
        title: "Désactiver l'entreprise",
        message: "Voulez vous désactiver l'entreprise ? \nTous les partenaires appartenant à cette entreprise seront désactivés",
        yesText: "Oui",
        noText: "Non"
      }).then(() => {
        const disablingCommentForm = <DisablingCommentForm
          title="Désactiver l'entreprise"
          onSubmit={({comment}) =>{ dialog.close(); toggleCompany(comment); }}
          close={dialog.close} />
        dialog.open(disablingCommentForm)
      }).catch(error => console.log("rejected", error))
    }
    else toggleCompany()
  }
  return (
    <Button
      disabled={updateCompanyStatusRequest.pending}
      variant="outlined"
      size="small"
      classes={{ root: _.get(company, 'status.state') === 'enabled' ? 'cmp-disableButton' : 'cmp-enableButton' }}
      onClick={handleClick}>
      {_.get(company, 'status.state') === 'enabled' ? 'Désactiver' : 'Activer'}
    </Button>

  )
}

const CompaniesList = (props) => {

  const dialog = useDialog()
  const columns = [
    { key: 'name', name: 'Nom' },
    { key: 'createdAt', name: 'Créé le' },
    { key: 'providedServices', name: 'Services' },
    { key: 'partners', name: 'Partenaires' },
    { key: 'commissions', name: 'Commissions' },
    { key: 'paid', name: 'Payé' },
    { key: 'toPay', name: 'Reste à payer' },
    { key: 'status', name: 'Statut' },
    { key: 'actions', name: 'actions' },
    { key: 'options', name: "Options" }
  ]
  const filters = [
    { key: 'status', name: 'Statut', type: 'select', value: 'all', fields: ['status'], options: companyStatus },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash', '').substring(1), fields: ['name', 'createdAt', 'providedServices'] }
  ]

  const openCompanyForm = (company) => {
    const companyForm = <CompanyForm
      company={company}
      services={props.services}
      close={dialog.close}
      updateCompany={props.updateCompany}
      addCompany={props.addCompany} />
    dialog.open(companyForm)
  }

  const openPaymentForm = (company) => {
    const paymentForm = <PaymentForm
      payer={{company: company._id}}
      toPay={company.toPay?.toFixed(2)}
      close={dialog.close}
      addPayment={props.addPayment}
    />
    dialog.open(paymentForm)
  }

  const openLoggingView = (loggingId) => {
    const loggingView = <LoggingView id={loggingId} creatonTitle='Création du compte entreprise' />
    dialog.open(loggingView)
  }

  const rows = _.get(props, 'companies', []).map(company => {
    const providedServices = company.providedServices?.map(e => props.services?.find(s => s._id === e.service)?.name).join(', ')
    return {
      name: { value: company.name, render: <div className='cmp-companyCell'>{company.name}</div> },
      createdAt: { value: format(new Date(company.createdAt), 'dd/MM/yyyy'), render: <div className='cmp-smallCell'>{format(new Date(company.createdAt), 'dd/MM/yyyy')}</div> },
     
      providedServices: {
        value: providedServices,
        render: <div className='cmp-smallCell cmp-servicesList'>
          <p>{providedServices}</p></div>
      },
      partners: {
        render:
          company.partnersCount > 0 && <Link to={{ pathname: '/partners', hash: company.name }}>
            <div className='fs18 lh25 bold txtac'>{company.partnersCount}</div>
          </Link>
      },
      commissions: {
        render:
          <Link to={{ pathname: '/orders', hash: company.name }}>
            <div className='lh25 txtac'>{company.totalCommissions} DA</div>
          </Link>
      },
      paid: {
        render:
          <Link to={{ pathname: '/payment', hash: company.name }}>
            <div className='lh25 txtac cgreen'>{company.totalPayments} DA</div>
          </Link>
      },
      toPay: {
        value: company.toPay,
        render: <div className='fs18 lh25 bold txtac corange'>{company.toPay} <span className='fs14'>DA</span></div>       
      },
      status: {
        value: _.get(company, 'status.state'),
        render: <Status value={_.get(company, 'status.state')} />
      },
      actions: {
        render: <CompanyActions company={company} updateCompanyStatus={props.updateCompanyStatus} />
      },
      options: {
        render:
          <div className='flex row'>
            <Tooltip title="Modifier" placement="top">
              <IconButton
                onClick={() => openCompanyForm(company)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Effectuer paiement" placement="top">
              <IconButton onClick={() => openPaymentForm(company)}>
                <PaymentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Historique" placement="top">
              <IconButton
                disabled={!company.logging}
                onClick={() => openLoggingView(company.logging)}>
                <AssignmentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
      }
    }

  })

  return (
    <div className='cmp-CompaniesList brad15 bwhite'>
      <TableList title='Entreprises'
        subTitle={`${_.get(props, 'companies.length', '--')} entreprise(s)`}
        columns={columns}
        rows={rows}
        filters={filters}
        withRefresh={true}
        withAddButton={true}
        onAddClick={() => openCompanyForm()}
        onRefresh={props.reload}
        sum={{ key:'toPay', render: (sum) => <div className='flex row aic fs20 cgrey extralight'>Total des commissions non payées <span className='cmp-total bold fs35 cstrongblue'>{sum}</span> DA</div>}}
        loading={props.loading}
        error={props.error} />
    </div>
  )
}

export default CompaniesList;