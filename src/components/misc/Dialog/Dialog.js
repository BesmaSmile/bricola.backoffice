
import React, {useState, createContext, useContext} from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import './Dialog.scss';

const ConfirmDialog=({title, message, yesText, noText, onSubmit, onClose})=>{
  return (
    <div className='dlg-confirm'>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
      {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit}>{yesText}</Button>
        <Button onClick={onClose}>{noText}</Button>
      </DialogActions>
    </div>

  )
}
const DialogContext = createContext();


const DialogProvider= ({ children })=>{
  const [_open, _setOpen]=useState(false)
  const [_disableBackdropClick, _setDisableBackdropClick]=useState()
  const [_content, _setContent]=useState(<></>)
  const awaitingPromiseRef = React.useRef();
  const open = (content, disableBackdropClick) => {
    _setDisableBackdropClick(disableBackdropClick)
    _setContent(content)
    _setOpen(true);
  };

  
  const close=()=>{
    _setOpen(false)
    _setContent(<></>)
  }

  const closeConfirmation=()=>{
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
    close()
  }

  const submitConfirmation = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
    close()
  };

  const openConfirmation =(props)=>{
    _setContent(<ConfirmDialog {...props} onSubmit={submitConfirmation} onClose={closeConfirmation}/>)
    _setOpen(true)
    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  }


  return(
    <>
      <DialogContext.Provider children={children} value={{open, close, openConfirmation }}/>
      <div className='Dialog'>
        <MuiDialog open={_open} disableBackdropClick={_disableBackdropClick} onClose={()=>_setOpen(false)} children={_content}/>
      </div>
    </>
  )
}
export {DialogProvider}

const useDialog = () => useContext(DialogContext)

export {useDialog}