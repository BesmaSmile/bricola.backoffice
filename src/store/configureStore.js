import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user']
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store= createStore(
  pReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

export const persistor = persistStore(store);