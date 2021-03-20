import {apiConstants} from 'consts'
import {handleResponse} from 'functions';

export const loggingService={
  getLogging,
}

function getLogging(auth, id){
  const requestUrl =`${apiConstants.URL}/logging/get/${id}` 
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
    .then(logging=>logging.actions.sort((a1,a2)=>new Date(a2.at) - new Date(a1.at)))
    .catch(error=>{
      console.log(error);
      throw 'Echec de chargement de l\'historiques des actions !';
    });
}
