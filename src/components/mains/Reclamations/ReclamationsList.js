import React, { useEffect } from 'react';
import SvgIcon from 'components/misc/SvgIcon/SvgIcon';
import TableList from 'components/misc/TableList/TableList';
import Status from 'components/misc/Status/Status';
import ReclamationCommentForm from 'components/misc/ReclamationCommentForm/ReclamationCommentForm';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import LoggingView from 'components/misc/LoggingView/LoggingView';
import AssignmentIcon from '@material-ui/icons/AssignmentRounded';
import OpenInNewIcon from '@material-ui/icons/OpenInNewRounded';
import ChatIcon from '@material-ui/icons/ChatRounded';
import { Link } from "react-router-dom";
import { useDialog } from 'components/misc/Dialog/Dialog';
import { useSnackbar } from 'notistack';
import { hooks } from 'functions';
import { format } from 'date-fns';
import _ from 'lodash';
import './Reclamations.scss';

const reclamationStatus = [
  { value: 'all', name: 'Tout' },
  { value: 'pending', name: 'Ouverte' },
  { value: 'closed', name: 'Clôturée' }
]
const ReclamationActions = props => {
  const { reclamation } = props
  const { enqueueSnackbar } = useSnackbar();
  const dialog = useDialog()
  const closeReclamationRequest = hooks.useRequest()

  const closeReclamation = () => {
    closeReclamationRequest.execute({
      action: () => props.closeReclamation(reclamation._id),
      success: () => enqueueSnackbar(`La réclamation a bien clôturée !`, { variant: 'success' }),
      failure: (error) => enqueueSnackbar(error, { variant: 'error' }),
    })
  }

  const handleClick = () => {
    dialog.openConfirmation({
      title: "Clôturer la réclamation",
      message: "Voulez vous clôturer la réclamation ?",
      yesText: "Oui",
      noText: "Non"
    }).then(() => {
      closeReclamation()
    }).catch(error => console.log("rejected", error))
  }
  return (
    /*<ButtonWrapper 
      neededPermission={permissionConstants.TOGGLE_CLIENT_ACCOUNT}
    button={(disabled)=>*/
    <Button
      disabled={/*disabled || */closeReclamationRequest.pending}
      variant="outlined"
      size="small"
      classes={{ root: 'rcl-closeButton' }}
      onClick={handleClick}>
      Clotûrer
    </Button>
    /*}
    />*/

  )
}

const ReclamationsList = (props) => {

  const dialog = useDialog()
  const columns = [
    { key: 'order', name: 'N° commande' },
    { key: 'client', name: 'Client' },
    { key: 'partner', name: 'Partenaire' },
    { key: 'service', name: 'Service' },
    { key: 'createdAt', name: 'Créée le' },
    { key: 'lastComment', name: 'Dernier commentaire' },
    { key: 'status', name: 'Statut' },
    { key: 'closedAt', name: 'Clôturée le' },
    { key: 'actions', name: 'actions' },
    { key: 'options', name: 'Options' }
  ]
  const filters = [
    { key: 'status', name: 'Statut', type: 'select', value: 'all', fields: ['status'], options: reclamationStatus },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash').substring(1), fields: ['client.lastname', 'client.firstname', 'client.phoneNumber', 'partner.lastname', 'partner.firstname', 'partner.phoneNumber', 'createdAt', 'closedAt', 'lastComment', 'order', 'service'] }
  ]

  const openReclamationCommentForm = (reclamationId) => {
    const reclamationForm = <ReclamationCommentForm
      close={dialog.close}
      reclamationId={reclamationId}
      addComment={props.addComment} />
    dialog.open(reclamationForm)
  }

  const openCommentsView = (comments) => {
    const commentsView = (
      <div className='rcl-commetnsView w450 pad20'>
        <div className='marb20 fs18 bold'>Commentaires</div>
        {comments.map((comment, i) => {
          const commentLines = comment.content.match(/[^\r\n]+/g);
          return (
            <div key={i} className='flex marv15'>
              <div className='rcl-commentDate marr20 fs12 cgrey'>{format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')} </div>
              <div className='rcl-commentContent extralight padv5 padh10 fs14'>
                {commentLines.map((line, i)=><div key={i}>{line}</div>)}
              </div>
            </div>
          )
        })}
      </div>
    )
    dialog.open(commentsView)
  }

  const openLoggingView = (loggingId) => {
    const loggingView = <LoggingView id={loggingId} creatonTitle='Création de la réclamation' />
    dialog.open(loggingView)
  }

  const rows = _.get(props, 'reclamations', []).map(reclamation => {
    const comments = reclamation.comments.sort((c1, c2) => new Date(c1.createdAt) - new Date(c2.createdAt))
    return {
      order: {
        value: reclamation.order.reference,
        render: <Link to={{ pathname: '/orders', hash: reclamation.order.reference }}>
            <div className='rcl-reclamationCell'>{reclamation.order.reference}</div>
          </Link>
      },
      client: {
        firstname: { value: _.get(reclamation, 'order.client.firstname') },
        lastname: { value: _.get(reclamation, 'order.client.lastname') },
        phoneNumber: { value: _.get(reclamation, 'order.client.phoneNumber') },
        render: <div className='rcl-reclamationCell'>
          <div>{_.get(reclamation, 'order.client.firstname')} {_.get(reclamation, 'order.client.lastname')}</div>
          <div className='rcl-smallText'>{_.get(reclamation, 'order.client.phoneNumber')}</div>
        </div>
      },
      partner: {
        firstname: { value: _.get(reclamation, 'order.partner.firstname') },
        lastname: { value: _.get(reclamation, 'order.partner.lastname') },
        phoneNumber: { value: _.get(reclamation, 'order.partner.phoneNumber') },
        render: <div className='rcl-reclamationCell'>

          <div>{_.get(reclamation, 'order.partner.firstname')} {_.get(reclamation, 'order.partner.lastname')}</div>
          <div className='rcl-smallText'>{_.get(reclamation, 'order.partner.phoneNumber')}</div>
        </div>
      },
      service: { value: reclamation.order.service.name, render: <div className='ord-orderCell'>{reclamation.order.service.name}</div> },
      createdAt: { value: format(new Date(reclamation.createdAt), 'dd/MM/yyyy'), render: <div className='rcl-smallText'>{format(new Date(reclamation.createdAt), 'dd/MM/yyyy')}</div> },
      closedAt: { value: reclamation.closedAt ? format(new Date(reclamation.closedAt), 'dd/MM/yyyy') : '', render: <div className='rcl-smallText'>{reclamation.closedAt ? format(new Date(reclamation.closedAt), 'dd/MM/yyyy') : ''}</div> },
      lastComment: {
        value: reclamation.comments[0].content,
        render: <div className='rcl-smallText rcl-comment flex row aic'>
          <p>{comments[comments.length - 1].content}</p>

          <div className='pointer' onClick={() => openCommentsView(comments)}>
            <Tooltip title="Afficher tous les commentaires" placement="top">
              <OpenInNewIcon fontSize="small" />
            </Tooltip>
          </div>
        </div>
      },
      status: {
        value: reclamation.status,
        render: <Status value={reclamation.status} />
      },
      actions: {
        render: reclamation.status === 'pending' && <ReclamationActions reclamation={reclamation} closeReclamation={props.closeReclamation} />
      },
      options: {
        render:
          <div className='flex row'>
            <Tooltip title="Ajouter un commentaire" placement="top">
              <IconButton disabled={reclamation.status === 'closed'}
                onClick={() => openReclamationCommentForm(reclamation._id)}>
                <ChatIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Historique" placement="top">
              <IconButton
                disabled={!reclamation.logging}
                onClick={() => openLoggingView(reclamation.logging)}>
                <AssignmentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
      }
    }

  })

  return (
    <div className='rcl-ReclamationsList brad15 bwhite'>
      <TableList title='Réclamations'
        subTitle={`${_.get(props, 'reclamations.length', '--')} réclamation(s)`}
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

export default ReclamationsList;