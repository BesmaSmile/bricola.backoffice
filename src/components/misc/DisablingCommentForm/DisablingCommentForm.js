import React from 'react';
import Form from 'components/misc/Form/Form';
import _ from 'lodash';

const DisablingCommentForm = props => {
  const { close, onSubmit, title } = props
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
    <div className='DisablingCommentForm w500'>
      <Form title={title}
        inputs={commentInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default DisablingCommentForm;