import React from 'react';
import TableList from 'components/misc/TableList/TableList';
import Status from 'components/misc/Status/Status';
import ReclamationForm from 'components/misc/ReclamationForm/ReclamationForm';
import { IconButton, Tooltip } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAddRounded';
import OpenInNewIcon from '@material-ui/icons/OpenInNewRounded';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardRounded';
import BlockRoundedIcon from '@material-ui/icons/BlockRounded';
import OrderDetails from './OrderDetails';
import { Link } from "react-router-dom";
import { useDialog } from 'components/misc/Dialog/Dialog';
import { format } from 'date-fns';
import { hooks } from 'functions';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import './Orders.scss';

const orderStatus = [
  { value: 'all', name: 'Tout' },
  { value: 'finished', name: 'Terminée' },
  { value: 'order_pending', name: 'En attente' },
  { value: 'accepted', name: 'Acceptée' },
  { value: 'ongoing', name: 'En cours' },
  { value: 'not_satisfied', name: 'Non satisfaite' },
  { value: 'canceled', name: 'Annulée' },
]

const OrdersList = (props) => {
  const cancelOrderRequest = hooks.useRequest()
  const dialog = useDialog();
  const { enqueueSnackbar } = useSnackbar();
  const columns = [
    { key: 'reference', name: 'N° commande' },
    { key: 'client', name: 'Client' },
    { key: 'partner', name: 'Partenaire' },
    { key: 'createdAt', name: 'Créé le' },
    { key: 'service', name: 'Service' },
    { key: 'toPay', name: 'Montant' },
    { key: 'status', name: 'Statut' },
    { key: 'options', name: 'Options' }
  ]

  const filters = [
    { key: 'status', name: 'Statut', type: 'select', value: 'all', fields: ['status'], options: orderStatus },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash', '').substring(1), fields: ['reference', 'client.name', 'client.phoneNumber', 'partner.name', 'partner.phoneNumber', 'createdAt', 'service'] }
  ]

  const openReclamationForm = (order) => {
    const reclamationForm = <ReclamationForm
      close={dialog.close}
      order={order}
      addReclamation={props.addReclamation} />
    dialog.open(reclamationForm)
  }

  const openOrderDetails = (order) => {
    const orderDetails = <OrderDetails order={order} />
    dialog.open(orderDetails)
  }

  const cancelOrder = (orderId) => {
    dialog.openConfirmation({
      title: "Annuler la commande",
      message: "Voulez vous annuler la commande ?",
      yesText: "Oui",
      noText: "Non"
    }).then(() => {
      cancelOrderRequest.execute({
        action: () =>  props.cancelOrder(orderId),
        success: () => enqueueSnackbar("La commande a été annulée", { variant: 'success' }),
        failure: (error) => enqueueSnackbar(error, { variant: 'error' }),
      })
     
    }).catch(error => console.log(error))
  }

  const rows = _.get(props, 'orders', []).map(order => {
    const status = _.get(order, 'status.state')?.replace('pending', 'order_pending');
    return {
      reference: {
        value: order.reference,
        render: <div className='ord-smallText'>{order.reference}</div>
      },
      client: {
        name: { value: `${order.client.firstname} ${order.client.lastname}` },
        phoneNumber: { value: order.client.phoneNumber },
        render: <div className='ord-orderCell'>
          <div>{order.client.firstname} {order.client.lastname}</div>
          <div className='ord-smallText'>{order.client.phoneNumber}</div>
        </div>
      },
      partner: {
        name: { value: order.partner? `${order.partner.firstname} ${order.partner.lastname}` : '' },
        phoneNumber: { value: _.get(order, 'partner.phoneNumber') },
        render: <div className='ord-orderCell'>
          {order.partner ? <>
            <div>{order.partner.firstname} {order.partner.lastname}</div>
            <div className='ord-smallText'>{_.get(order, 'partner.phoneNumber', '---')}</div></>
            : '---'
          }
        </div>
      },
      createdAt: { value: format(new Date(order.createdAt), 'dd/MM/yyyy'), render: <div className='ord-smallText'>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</div> },
      service: { value: order.service.name, render: <div className='ord-orderCell'>{order.service.name}</div> },
      toPay: { value: order.toPay, render: order.toPay && <div className='ord-orderCell'>{order.toPay} DA</div> },
      commission: { value: order.commission, render: order.commission !== undefined && props.commissionPermission && <div className='ord-orderCell'>{order.commission?.toFixed(2)} DA</div> },
      status: {
        value: status,
        render: <Status value={status} />
      },
      options: {
        render:
          <div className='flex row'>
            {order.reclamation ?
              <Tooltip title="Aller à la réclamation" placement="top">
                <Link to={{ pathname: '/reclamations', hash: order.reference }}>
                  <IconButton>
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Link>
              </Tooltip> :
              <Tooltip title="Ajouter réclamation" placement="top">
                <IconButton disabled={order.status.state !== 'finished'}
                  onClick={() => openReclamationForm(order)}>
                  <PostAddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
            <Tooltip title="Ouvrir la commande" placement="top">
              <IconButton
                onClick={() => openOrderDetails(order)}>
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Annuler la commande" placement="top">
              <IconButton
                disabled={status !== 'accepted'}
                onClick={() => cancelOrder(order._id)}>
                <BlockRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
      }
    }
  })

  return (
    <div className='ord-OrdersList brad15 bwhite'>
      <TableList title='Commandes'
        subTitle={`${_.get(props, 'orders.length', '--')} commande(s)`}
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

export default OrdersList;