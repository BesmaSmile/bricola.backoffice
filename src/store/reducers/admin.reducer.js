import {adminConstants} from 'store/constants';

export function admin(state = {}, action) {
  switch(action.type) {
    case adminConstants.GET_ADMINS :
    return {
        ...state,
        admins : action.admins
    }
    case adminConstants.ADD_ADMIN :
    return {
        ...state,
        admins : [action.admin,...state.admins]
    }
    case adminConstants.UPDATE_ADMIN :
    return {
      ...state,
      admins : state.admins.map(admin=>
        admin._id===action.admin._id ? action.admin : admin)
    }
    default :
    return state
  }
}
