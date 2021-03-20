import {apiConstants} from 'consts'
import {handleResponse} from 'functions';

export const reclamationService={
  getReclamations,
  addReclamation,
  addComment,
  closeReclamation
}

function getReclamations(auth){
  const requestUrl =`${apiConstants.URL}/reclamation/get_all` 
  const requestOptions={
    method: 'GET',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .then(reclamations=>reclamations.sort((r1,r2)=>new Date(r2.createdAt) - new Date(r1.createdAt))
      .map(reclamation=>({...reclamation, comments : reclamation.comments.sort((c1,c2)=>new Date(c2.createdAt) - new Date(c1.createdAt))})))
    .catch(error=>{
      console.log(error);
      throw 'Echec de chargement de la liste des partenaires !'
    });
}

function addReclamation(auth, id, comment){
  const requestUrl =`${apiConstants.URL}/reclamation/create/${id}` 
  const requestOptions={
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body : JSON.stringify({comment})
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}

function addComment(auth, id, comment){
  const requestUrl =`${apiConstants.URL}/reclamation/add_comment/${id}` 
  const requestOptions={
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body : JSON.stringify({comment})
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}

function closeReclamation(auth, id){
  const requestUrl =`${apiConstants.URL}/reclamation/close/${id}` 
  const requestOptions={
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}