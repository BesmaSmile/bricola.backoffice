import React, {useRef} from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/CloseRounded';
import _ from 'lodash';
import './ImageUploader.scss'; 

const ImageUploader=props=>{ 
  const {image, pending, updateImage, preview, emptyPreview}=props
  const fileInput=useRef()
  const handleChange= e => {
    if (e.target.files.length) {
      updateImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      })
    }
  }

  const removeImage=(e)=>{
   fileInput.current.value=""
    updateImage({
      preview: "",
      raw: ""
    })
  }

  const id = Math.random();

  return( 
    <div className='ImageUploader relw100 relh100'>
      {!_.isEmpty(image.preview) && 
        <IconButton  size="small" label="supprimer" onClick={removeImage}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      <label htmlFor={`${id}imgup-uploadButton`}> 
          {!_.isEmpty(image.preview)  ?  preview(image.preview) : emptyPreview()}
      </label>
      <input
        ref={fileInput}
        type="file"
        id={`${id}imgup-uploadButton`}
        style={{ display: "none" }}
        onChange={handleChange}
        disabled={pending}
      />
    </div>
  )
}


export default ImageUploader