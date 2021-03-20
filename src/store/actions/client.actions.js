import {clientService} from 'services';
import {clientConstants} from 'store/constants';

export const clientActions= {
  getClients,
  updateClientStatus
}

function getClients(auth){
  return dispatch => {
    return clientService.getClients(auth).then(clients=>{
      dispatch({ type: clientConstants.GET_CLIENTS, clients })
      return clients;
    })
  }
}

function updateClientStatus(auth, id, status){
    return dispatch => {
      return clientService.updateClientStatus(auth, id, status).then((client)=>{
        dispatch({ type: clientConstants.UPDATE_CLIENT, client })
        return client
      })
    }
  }
