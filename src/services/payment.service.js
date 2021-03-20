import {apiConstants} from 'consts'
import {handleResponse} from 'functions';

export const paymentService={
  getPayments,
  addPayment,
}

function getPayments(auth){
  const requestUrl =`${apiConstants.URL}/payment/get_all` 
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
    .then(payments=>payments.sort((p1,p2)=>new Date(p2.createdAt) - new Date(p1.createdAt)))
    .catch(error=>{
      console.log(error);
      throw 'Echec de chargement de la liste de paiements !'
    });
}

function addPayment(auth, payment){
  const requestUrl =`${apiConstants.URL}/payment/create` 
  const requestOptions={
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body : JSON.stringify(payment)
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw "Echec d'enregistrement du paiement"
    })
}
