import {referentialConstants} from 'store/constants';

export function referential(state = {}, action) {
  switch(action.type) {
    case referentialConstants.GET_PROVINCES :
    return {
        ...state,
        provinces : action.provinces
    }
    default: 
    return state
  }
}