import {apiConstants} from 'consts'
import {handleResponse} from 'functions';

export const orderService={
  getOrders,
  cancelOrder,
}

function getOrders(auth){
  const requestUrl =`${apiConstants.URL}/order/get_all` 
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
    .then(orders=>orders.sort((o1,o2)=>new Date(o2.createdAt) - new Date(o1.createdAt)))
    .catch(error=>{
      console.log(error);
      throw 'Echec de chargement de la liste des partenaires !'
    });
}

function cancelOrder(auth, id){
  const requestUrl =`${apiConstants.URL}/order/cancel_by_admin/${id}` 
  const requestOptions={
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}
