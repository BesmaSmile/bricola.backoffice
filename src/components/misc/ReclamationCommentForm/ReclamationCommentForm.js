import React, {useState} from 'react';
import Form from 'components/misc/Form/Form';
import { hooks } from 'functions/hooks';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

const ReclamationCommentForm = props => {
  const { close, reclamationId, addComment } = props
  const commentRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = values => {
    commentRequest.execute({
      action: () => addComment( reclamationId,values.comment),
      success: (res) => {
        enqueueSnackbar(`Le commentaire à bien été enregistrée !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }

  const commentInputs = [
    {
      name: 'comment',
      label: 'Commentaire',
      validation: { required: 'Champs requis' },
      multiline :true,
      rows : 4
    },
  ]

  return (
    <div className='ReclamationCommentForm w500'>
      <Form title={"Nouveau commentaire"}
        inputs={commentInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={commentRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default ReclamationCommentForm;