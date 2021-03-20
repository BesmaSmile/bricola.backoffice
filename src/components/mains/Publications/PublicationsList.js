import React from 'react';
import TableList from 'components/misc/TableList/TableList';
import { IconButton, Tooltip } from '@material-ui/core';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';
import PublicationForm from 'components/misc/PublicationForm/PublicationForm';
import { useDialog } from 'components/misc/Dialog/Dialog';
import { useSnackbar } from 'notistack';
import { apiConstants } from 'consts';
import logo from 'assets/img/logo.png';
import { format } from 'date-fns';
import { hooks } from 'functions';
import _ from 'lodash';
import './Publications.scss';

const PublicationsList = (props) => {
  const { removePublication } = props
  const dialog = useDialog()
  const removePublicationRequest = hooks.useRequest();
  const { enqueueSnackbar } = useSnackbar();
  const columns = [
    { key: 'image', name: '' },
  ]
  const filters = []


  const handleRemovePublication = (publicationId) => {
    dialog.openConfirmation({
      title: "Supprimer la publication",
      message: "Voulez vous supprimer la publication ?",
      yesText: "Oui",
      noText: "Non"
    }).then(() => {
      removePublicationRequest.execute({
        action: () => removePublication(publicationId),
        success: () => enqueueSnackbar('La publication a été supprimée', { variant: 'success' }),
        failure: (error) => enqueueSnackbar(error, { variant: 'error' }),
      })
    }).catch(error => console.log("rejected"))
  };
  const rows = _.get(props, 'publications', []).map(publication => {
    return {
      image: {
        render: <div className='flex col'>
          <div className='pbl-dateCell'>Crée le {format(new Date(publication.createdAt), 'dd/MM/yyyy')}</div>
          <div className='pbl-imageContainer'>
            <img className='pbl-image marr10' src={publication.image ? `${apiConstants.URL}/publication/image/${publication.image}` : logo} alt="" />
            <IconButton  size="small" label="supprimer" onClick={() => handleRemovePublication(publication._id)}>
              <CloseIcon fontSize="small" />
            </IconButton>
           </div> 
        </div>
      },
      options: {
        render:
          <div className='flex row'>
            <Tooltip title="Modifier" placement="top">
              <IconButton
                // onClick={() => openPublicationForm(publication)}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
      }
    }

  })
  const openPublicationForm = (service) => {
    const serviceForm = <PublicationForm
      close={dialog.close}
      addPublication={props.addPublication} />
    dialog.open(serviceForm)
  }


  return (
    <div className='pbl-PublicationsList brad15 bwhite'>
      <TableList title='Publications'
        subTitle={`${_.get(props, 'publications.length', '--')} publication(s)`}
        columns={columns}
        rows={rows}
        filters={filters}
        withRefresh={true}
        withAddButton={true}
        onAddClick={() => openPublicationForm()}
        onRefresh={props.reload}
        loading={props.loading}
        error={props.error} />
    </div>
  )
}

export default PublicationsList;