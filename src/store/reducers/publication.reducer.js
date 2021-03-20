import {publicationConstants} from 'store/constants';

export function publication(state = {}, action) {
  switch(action.type) {
    case publicationConstants.GET_PUBLICATIONS :
    return {
        ...state,
        publications : action.publications
    }
    case publicationConstants.ADD_PUBLICATION :
    return {
        ...state,
        publications : [action.publication,...state.publications]
    }
    case publicationConstants.REMOVE_PUBLICATION :
      return {
        ...state,
        publications: state.publications.filter(publication => publication._id !== action.publicationId)
      }
    default :
    return state
  }
}
