import {loggingService} from 'services';
import {loggingConstants} from 'store/constants';

export const loggingActions= {
  getLogging,
}

function getLogging(auth, id){
  return dispatch => {
    return loggingService.getLogging(auth, id).then(actions=>{
      dispatch({ type: loggingConstants.GET_LOGGING, actions, id })
      return actions;
    })
  }
}