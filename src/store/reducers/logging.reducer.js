import {loggingConstants} from 'store/constants';

export function logging(state = { logging: {}}, action) {
  switch(action.type) {
    case loggingConstants.GET_LOGGING :
    return {
        ...state,
        logging : {
          ...state.logging,
          [action.id] : action.actions
        }
    }
    default :
    return state
  }
}
