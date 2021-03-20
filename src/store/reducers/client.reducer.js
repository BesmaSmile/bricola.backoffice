import {clientConstants} from 'store/constants';

export function client(state = {}, action) {
  switch(action.type) {
    case clientConstants.GET_CLIENTS :
    return {
        ...state,
        clients : action.clients
    }
    case clientConstants.UPDATE_CLIENT :
      return {
        ...state,
        clients : state.clients.map(client=>
          client._id===action.client._id ? action.client : client)
      }
    default :
    return state
  }
}
