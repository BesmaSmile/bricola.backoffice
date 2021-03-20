import React, {createRef} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/index.scss';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import  { persistor, store } from 'store/configureStore'
import { PersistGate } from 'redux-persist/lib/integration/react';
import { SnackbarProvider } from 'notistack';
import { DialogProvider} from 'components/misc/Dialog/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/CloseRounded';
import 'fontsource-roboto';

import App from 'App';

const notistackRef = createRef();

const onClickDismiss = key => () => { 
  notistackRef.current.closeSnackbar(key);
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading</div>} persistor={persistor}>
        <SnackbarProvider
          maxSnack={3} 
          autoHideDuration={3000} 
          ref={notistackRef}
          action={(key) => (
              <IconButton size="small" label="fermer" onClick={onClickDismiss(key)}>
                <CloseIcon classes={{root : 'snackbar-closeIcon'}} fontSize="small" />
              </IconButton>
          )}>
          <DialogProvider >
            <BrowserRouter>
              <App/>
            </BrowserRouter>
          </DialogProvider>
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
