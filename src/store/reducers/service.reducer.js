import {serviceConstants} from 'store/constants';

export function service(state = {}, action) {
  switch(action.type) {
    case serviceConstants.GET_SERVICES :
    return {
        ...state,
        services : action.services
    }
    case serviceConstants.ADD_SERVICE :
    return {
        ...state,
        services : [action.service,...state.services]
    }
    case serviceConstants.UPDATE_SERVICE :
    return {
      ...state,
      services : state.services.map(service=>
        service._id===action.service._id ? action.service : service)
    }
    default :
    return state
  }
}
