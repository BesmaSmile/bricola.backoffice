import { apiConstants } from 'consts'
import { handleResponse } from 'functions';

export const promoCodeService = {
  getPromoCodes,
  addPromoCode,
}

function getPromoCodes(auth) {
  const requestUrl = `${apiConstants.URL}/promocode/get_all`
  const requestOptions = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .then(partners => partners.sort((c1, c2) => new Date(c2.createdAt) - new Date(c1.createdAt)))
    .catch(error => {
      console.log(error);
      throw 'Echec de chargement de la liste des codes promo !'
    });
}

function addPromoCode(auth, promoCode) {
  const requestUrl = `${apiConstants.URL}/promocode/create`
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promoCode)
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      let message = ''
      switch (error.field) {
        case 'name':
          switch (error.code) {
            case 'existing_name':
              message = "Une entreprise existe avec ce nom"
              break;
          }
          break;
        default:
          message = 'Une erreur est survenue !'
      }
      throw message
    })
}