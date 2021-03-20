import {reclamationConstants} from 'store/constants';

export function reclamation(state = {}, action) {
  switch(action.type) {
    case reclamationConstants.GET_RECLAMATIONS :
    return {
        ...state,
        reclamations : action.reclamations
    }
    case reclamationConstants.ADD_RECLAMATION :
    return {
        ...state,
        reclamations : state.reclamations && [action.reclamation,...state.reclamations]
    }
    case reclamationConstants.ADD_COMMENT :
    return {
        ...state,
        reclamations : state.reclamations.map(reclamation => 
          reclamation._id ===action.id ? action.reclamation : reclamation)
    }
    case reclamationConstants.CLOSE_RECLAMATION :
    return {
      ...state,
      reclamations : state.reclamations.map(reclamation=>
        reclamation._id===action.id ? {
          ...reclamation,
          status : 'closed',
          closedAt : action.closedAt
        } : reclamation)
    }
    default :
    return state
  }
}
