import {userConstants} from 'store/constants';

export function user(state = {user : {}}, action) {
  switch(action.type) {
    case userConstants.LOGGED_IN :
    return {
      ...state,
      auth : action.auth
    }
    case userConstants.GET_USER_INFOS : 
    return {
      ...state,
      user : action.user
    }
    case userConstants.LOGGED_OUT : 
    return {
      ...state,
      auth : undefined
    }
    default :
    return state
  }
  
}
