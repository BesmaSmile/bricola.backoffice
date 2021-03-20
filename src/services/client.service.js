import {apiConstants} from 'consts'
import {handleResponse} from 'functions';

export const clientService={
  getClients,
  updateClientStatus
}

function getClients(auth){
  const requestUrl =`${apiConstants.URL}/client/get_all` 
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
    .then(clients=>clients.sort((c1,c2)=>new Date(c2.createdAt) - new Date(c1.createdAt)))
    .catch(error=>{
      console.log(error);
      throw 'Echec de chargement de la liste des clients !'
    });
}

function updateClientStatus(auth, id, status){
  const requestUrl = `${apiConstants.URL}/client/update_status/${id}`
  const requestOptions = {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status })
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}