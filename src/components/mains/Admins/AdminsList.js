import React from 'react';
import TableList from 'components/misc/TableList/TableList';
import AdminForm from 'components/misc/AdminForm/AdminForm';
import PermissionsForm from 'components/misc/PermissionsForm/PermissionsForm';
import ChangePasswordForm from 'components/misc/ChangePasswordForm/ChangePasswordForm';
import DisablingCommentForm from 'components/misc/DisablingCommentForm/DisablingCommentForm';
import Status from 'components/misc/Status/Status';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import LoggingView from 'components/misc/LoggingView/LoggingView';
import AssignmentIcon from '@material-ui/icons/AssignmentRounded';
import SecurityIcon from '@material-ui/icons/SecurityRounded';
import LockIcon from '@material-ui/icons/LockRounded';
import { useDialog } from 'components/misc/Dialog/Dialog';
import { useSnackbar } from 'notistack';
import { hooks } from 'functions';
import { format } from 'date-fns';
import _ from 'lodash';
import './Admins.scss';

const adminStatus=[
  {value : 'all', name :'Tout'},
  {value : 'enabled', name :'Activé'},
  {value : 'disabled', name :'Désactivé'}
]
const AdminActions = props => {
  const { admin, updateAdminStatus } = props
  const { enqueueSnackbar } = useSnackbar();
  const dialog = useDialog()
  const updateAdminStatusRequest = hooks.useRequest()

  const toggleAccount = (comment = '') => {
    const status ={ state : _.get(admin, 'status.state') === 'disabled' ? 'enabled' : 'disabled', comment}
    updateAdminStatusRequest.execute({
      action: () => updateAdminStatus(admin._id, status),
      success: () => enqueueSnackbar(`Le compte de l'administrateur a bien été ${status.state === 'enabled' ? 'activé' : 'désactivé'} !`, { variant: 'success' }),
      failure: (error) => enqueueSnackbar(error, { variant: 'error' }),
    })
  }

  const handleClick = () => {
    if (_.get(admin, 'status.state') === 'enabled') {
      dialog.openConfirmation({
        title: "Désactiver le compte de l'administrateur",
        message: "Voulez vous désactiver le compte d'un administrateur ?",
        yesText: "Oui",
        noText: "Non"
      }).then(() => {
        const disablingCommentForm = <DisablingCommentForm
          title="Désactiver le compte de l'administrateur"
          onSubmit={({comment}) =>{ dialog.close(); toggleAccount(comment); }}
          close={dialog.close} />
        dialog.open(disablingCommentForm)
      }).catch(error => console.log("rejected"))
    }
    else toggleAccount()
  }
  return (
    <Button
      disabled={updateAdminStatusRequest.pending}
      variant="outlined" 
      size="small"
      classes={{ root:_.get(admin, 'status.state') === 'enabled' ? 'adm-disableButton' : 'adm-enableButton' }}
      onClick={handleClick}>
      {_.get(admin, 'status.state') === 'enabled' ? 'Désactiver' : 'Activer'}
    </Button>
    
  )
}

const AdminsList = (props) => {

  const dialog = useDialog()
  const columns = [
    { key: 'lastname', name: 'Nom' },
    { key: 'firstname', name: 'Prénom' },
    { key: 'createdAt', name: 'Créé le' },
    { key: 'email', name: 'Email' },
    { key: 'status', name: 'Statut' },
    { key: 'actions', name: 'actions' },
    { key: 'options', name: "Options" }
  ]
  const filters = [
    { key: 'status', name: 'Statut', type: 'select', value: 'all', fields: ['status'], options: adminStatus },
    { key: 'search', name: 'Rechercher', type: 'input', value: _.get(window.location, 'hash', '').substring(1), fields: ['lastname', 'firstname', 'email', 'createdAt'] }
  ]

  const openAdminForm = (admin) => {
    const adminForm = <AdminForm
      admin={admin}
      close={dialog.close}
      updateAdmin={props.updateAdmin}
      addAdmin={props.addAdmin} />
    dialog.open(adminForm)
  }

  const openPermissionsForm = (id, permissions) => {
    const permissionsForm = <PermissionsForm
      permissions={permissions}
      close={dialog.close}
      updateAdminPermissions={(permissions) => props.updateAdminPermissions(id, permissions)} />
    dialog.open(permissionsForm) 
  }

  const openChangePasswordForm = (id) => {
     const changePasswordForm = <ChangePasswordForm
      close={dialog.close}
      changeAdminPassword={(password) => props.changeAdminPassword(id, password)} />
    dialog.open(changePasswordForm) 
  }

  const openLoggingView = (loggingId) => {
    const loggingView =<LoggingView id={loggingId} creatonTitle='Création du compte'/>
    dialog.open(loggingView)
  }

  const rows = _.get(props, 'admins', []).map(admin => {
    return {
      lastname: { value: admin.lastname, render: <div className='adm-adminCell'>{admin.lastname}</div> },
      firstname: { value: admin.firstname, render: <div className='adm-adminCell'>{admin.firstname}</div> },
      createdAt: { value: format(new Date(admin.createdAt), 'dd/MM/yyyy'), render: <div className='adm-dateCell'>{format(new Date(admin.createdAt),'dd/MM/yyyy')}</div> },
      email:{ value: admin.email, render: <div className='adm-adminCell'>{admin.email}</div> },
      status: {
        value: _.get(admin, 'status.state'),
        render: <Status value={_.get(admin, 'status.state')}  comment={_.get(admin, 'status.comment')}/>
      },
      actions: {
        render: <AdminActions admin={admin} updateAdminStatus={props.updateAdminStatus} />
      },
      options: {
        render:
          <div className='flex row'>
            <Tooltip title="Permissions" placement="top">
              <IconButton 
                onClick={() => openPermissionsForm(admin._id, admin.permissions)}>
                <SecurityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
        
            <Tooltip title="Changer mot de passe" placement="top">
              <IconButton
                onClick={()=>openChangePasswordForm(admin._id)}>
                <LockIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Historique" placement="top">
              <IconButton
                disabled={!admin.logging}
                onClick={() => openLoggingView(admin.logging)}>
                <AssignmentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
      }
    }

  })

  return (
    <div className='adm-AdminsList brad15 bwhite'>
      <TableList title='Administrateurs'
        subTitle={`${_.get(props, 'admins.length', '--')} administrateur(s)`}
        columns={columns}
        rows={rows}
        filters={filters}
        withRefresh={true}
        withAddButton={true}
        onAddClick={()=>openAdminForm()}
        onRefresh={props.reload}
        loading={props.loading}
        error={props.error} />
    </div>
  )
}

export default AdminsList;