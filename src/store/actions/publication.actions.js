import {publicationService} from 'services/publication.service';
import {publicationConstants} from 'store/constants';

export const publicationActions= {
  getPublications,
  addPublication,
  removePublication,
}

function getPublications(auth){
  return dispatch => {
    return publicationService.getPublications(auth).then(publications=>{
      dispatch({ type: publicationConstants.GET_PUBLICATIONS, publications })
      return publications;
    })
  }
}

function addPublication(auth, publication){
  return dispatch => {
    return publicationService.addPublication(auth, publication).then(publication=>{
      dispatch({ type: publicationConstants.ADD_PUBLICATION, publication })
      return publication;
    })
  }
}

function removePublication(auth, publicationId){
  return dispatch => {
    return publicationService.removePublication(auth, publicationId).then(()=>{
      dispatch({ type: publicationConstants.REMOVE_PUBLICATION, publicationId })
      return publicationId;
    })
  }
}