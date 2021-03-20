import React, { useState } from 'react';
import Form from 'components/misc/Form/Form';
import { hooks } from 'functions/hooks';
import { useSnackbar } from 'notistack';
import ImageIcon from '@material-ui/icons/ImageRounded';
import ImageUploader from 'components/misc/ImageUploader/ImageUploader';

import './PublicationForm.scss'

const PublicationForm = props => {
  const { close, addPublication } = props
 const [_image, _setImage] = useState({ raw: "", preview : '' });
 const publicationRequest = hooks.useRequest()
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = values => {
    const toSend = {image : _image.raw }

    publicationRequest.execute({
      action: () => addPublication(toSend),
      success: (res) => {
        enqueueSnackbar(`La publication ont bien été enregistrée !`, { variant: 'success' })
        close()
      },
      failure: (error) => {
        enqueueSnackbar(error, { variant: 'error' })
      }
    })
  }

  const publicationInputs = [
    {
      content: ()=>
        <div className='flex row aife jcc mart10 marb20'>
          <div className='pf-imgContainer  w300 h200 marr20'>
            <ImageUploader
              image={_image}
              updateImage={_setImage}
              preview={(image) => <img className='pf-image' src={image} alt='' />}
              pending={publicationRequest.pending}
              emptyPreview={() =>
                <div className='relw100 relh100 flex aic jcc cgrey'>
                  <ImageIcon classes={{ root: 'pf-imgIcon' }} />
                </div>}
            />
          </div>
        </div>
    }
  ]
  return (
    <div className='PublicationForm w500'>
      <Form title={"Nouvelle publication"}
        inputs={publicationInputs}
        onSubmit={onSubmit}
        submitText='Enregistrer'
        pending={publicationRequest.pending}
        isDialog={true}
        cancel={close}
      />
    </div>
  )
}

export default PublicationForm;