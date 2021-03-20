import React from 'react';
import SvgIcon from 'components/misc/SvgIcon/SvgIcon';
import TableList from 'components/misc/TableList/TableList';
import Status from 'components/misc/Status/Status';
import DisablingCommentForm from 'components/misc/DisablingCommentForm/DisablingCommentForm';
import LoggingView from 'components/misc/LoggingView/LoggingView';
import AssignmentIcon from '@material-ui/icons/AssignmentRounded';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { Link } from "react-router-dom";
import { useDialog } from 'components/misc/Dialog/Dialog';
import { useSnackbar } from 'notistack';
import { hooks } from 'functions';
import { format } from 'date-fns';
import _ from 'lodash';
import './Clients.scss';

const clientStatus = [
  { value: 'all', name: 'Tout' },
  { value: 'enabled', name: 'Activé' },
  { value: 'disabled', name: 'Désactivé' }
]

const ClientActions = props => {
  const { client, updateClientStatus } = props
  const { enqueueSnackbar } = useSnackbar();
  const dialog = useDialog()
  const updateClientStatusRequest = hooks.useRequest()

  const toggleAccount = (comment = '') => {
    const status ={ state: _.get(client, 'status.state') === 'disabled' ? 'enabled' : 'disabled', comment }
    updateClientStatusRequest.execute({
      action: () => updateClientStatus(client._id, status),
      success: () => enqueueSnackbar(`Le compte du partenaire a bien été ${status === 'enabled' ? 'activé' : 'désactivé'} !`, { variant: 'success' }),
      failure: (error) => enqueueSnackbar(error, { variant: 'error' }),
    })
  }

  const handleClick = () => {
    if (_.get(client, 'status.state')=== 'enabled') {
      dialog.openConfirmation({
        title: "Désactiver le compte du client",
        message: "Voulez vous désactiver le compte d'un client ?",
        yesText: "Oui",
        noText: "Non"
      }).then(() => {
        const disablingCommentForm = <DisablingCommentForm
          title="Désactiver le compte du client"
          onSubmit={({comment}) =>{ dialog.close(); toggleAccount(comment); }}
          close={dialog.close} />
        dialog.open(disablingCommentForm)
      }).catch(error => console.log("rejected"))
    }
    else toggleAccount()
  }
  return (
    /*<ButtonWrapper 
      neededPermission={permissionConstants.TOGGLE_CLIENT_ACCOUNT}
    button={(disabled)=>*/
    <Button
      disabled={/*disabled || */updateClientStatusRequest.pending}
      variant="outlined"
      size="small"
      classes={{ root: _.get(client, 'status.state') === 'enabled' ? 'clt-disableButton' : 'clt-enableButton' }}
      onClick={handleClick}>
      {_.get(client, 'status.state')=== 'enabled' ? 'Désactiver' : 'Activer'}
    </Button>
    /*}
    />*/

  )
}

const ClientsList = (props) => {

  const dialog = useDialog()
  const columns = [
    { key: 'lastname', name: 'Nom' },
    { key: 'firstname', name: 'Prénom' },
    { key: 'createdAt', name: 'Créé le' },
    { key: 'phoneNumber', name: 'Téléphone' },
    { key: 'province', name: 'Wilaya' },
    { key: 'orders', name: 'Commandes' },
    { key: 'status', name: 'Statut' },
    { key: 'actions', name: 'actions' },
    { key: 'options', name: 'options' },
  ]
  const filters = [
    { key: 'status', name: 'Statut', type: 'select', value: 'all', fields: ['status'], options: clientStatus },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash', '').substring(1), fields: ['lastname', 'firstname', 'phoneNumber', 'province', 'createdAt'] }
  ]

  const openLoggingView = (loggingId) => {
    const loggingView =<LoggingView id={loggingId} creatonTitle='Création du compte'/>
    dialog.open(loggingView)
  }

  const rows = _.get(props, 'clients', []).map(client => {
    return {
      lastname: { value: client.lastname, render: <div className='clt-clientCell'>{client.lastname}</div> },
      firstname: { value: client.firstname, render: <div className='clt-clientCell'>{client.firstname}</div> },
      createdAt: { value: format(new Date(client.createdAt), 'dd/MM/yyyy'), render: <div className='clt-dateCell'>{format(new Date(client.createdAt), 'dd/MM/yyyy')}</div> },
      phoneNumber: { value: client.phoneNumber, render: <div className='clt-clientCell'>{client.phoneNumber}</div> },
      province: {
        value: _.get(client, 'province.name'),
        render: <div className='clt-detailContainer'>
          <div className='clt-datailTop'><SvgIcon name='mapLocation' color={_.get(client, 'province.name') ? 'var(--green)' : 'var(--lightgrey)'} /></div>
          <div className='clt-clientCell'> {_.get(client, 'province.name')} </div>
        </div>
      },
      orders: {
        value: client.ordersCount,
        render: client.ordersCount>0 && <Link to={{ pathname: '/orders', hash: client.phoneNumber }}>
          <div className='fs18 lh25 bold txtac'>{client.ordersCount}</div>
      </Link>
      },
      status: {
        value: _.get(client, 'status.state'),
        render: <Status value={_.get(client, 'status.state')}  comment={_.get(client, 'status.comment')} />
      },
      actions: {
        render: <ClientActions client={client} updateClientStatus={props.updateClientStatus} />
      },
      options: {
        render: <div className='flex row'>
          <Tooltip title="Historique" placement="top">
            <IconButton
              disabled={!client.logging}
              onClick={() => openLoggingView(client.logging)}>
              <AssignmentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
      </div>
      }
    }

  })

  return (
    <div className='clt-ClientsList brad15 bwhite'>
      <TableList title='Clients'
        subTitle={`${_.get(props, 'clients.length', '--')} client(s)`}
        columns={columns}
        rows={rows}
        filters={filters}
        withRefresh={true}
        onRefresh={props.reload}
        loading={props.loading}
        error={props.error} />
    </div>
  )
}

export default ClientsList;