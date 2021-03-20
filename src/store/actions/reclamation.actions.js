import {reclamationService} from 'services';
import {reclamationConstants} from 'store/constants';

export const reclamationActions= {
  getReclamations,
  addReclamation,
  closeReclamation,
  addComment
}

function getReclamations(auth){
  return dispatch => {
    return reclamationService.getReclamations(auth).then(reclamations=>{
      dispatch({ type: reclamationConstants.GET_RECLAMATIONS, reclamations })
      return reclamations;
    })
  }
}

function addReclamation(auth, id, comment){
  return dispatch => {
    return reclamationService.addReclamation(auth, id, comment).then(reclamation=>{
      dispatch({ type: reclamationConstants.ADD_RECLAMATION, id, reclamation })
      return reclamation;
    })
  }
}

function addComment(auth, id, comment){
  return dispatch => {
    return reclamationService.addComment(auth, id, comment).then(reclamation=>{
      dispatch({ type: reclamationConstants.ADD_COMMENT, id, reclamation })
      return reclamation;
    })
  }
}

function closeReclamation(auth, id){
  return dispatch => {
    return reclamationService.closeReclamation(auth, id).then((reclamation)=>{
      dispatch({ type: reclamationConstants.CLOSE_RECLAMATION, id, closedAt : reclamation.closedAt })
      return reclamation
    })
  }
}
