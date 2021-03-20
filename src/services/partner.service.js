import {apiConstants} from 'consts'
import {handleResponse} from 'functions';

export const partnerService={
  getPartners,
  addPartner,
  updatePartner,
  updatePartnerStatus
}

function getPartners(auth){
  const requestUrl =`${apiConstants.URL}/partner/get_all` 
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
    .then(partners=>partners.sort((p1,p2)=>new Date(p2.createdAt) - new Date(p1.createdAt)))
    .catch(error=>{
      console.log(error);
      throw 'Echec de chargement de la liste des partenaires !'
    });
}

function addPartner(auth, partner){
  const requestUrl =`${apiConstants.URL}/partner/register` 
  const requestOptions={
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body : JSON.stringify(partner)
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      let message = ''
      switch (error.field) {
        case 'email':
          switch (error.code) {
            case 'existing_email':
              message = "Un compte partenaire existe avec cette addresse email"
              break;
            default: message = 'Une erreur est survenue !'
          }
          break;
        case 'phoneNumber':
          switch (error.code) {
            case 'existing_phoneNumber' : 
            message = "Un comptepartenaire existe avec ce numéro de téléphone"
            break;
            case 'invalid_phone_number' :
            message = "Numéro de téléphone invalide"
            break;
            default: message = 'Une erreur est survenue !'
          }
          break;
        case 'password':
          switch (error.code) {
            case 'weak_password' : 
            message = "Mot de passe faible"
            break;
            default: message = 'Une erreur est survenue !'
          }
          break;
        default:
          message = 'Une erreur est survenue !'
      }
      throw message
    })
}

function updatePartner(auth, id, partner){
  const requestUrl =`${apiConstants.URL}/partner/update/${id}` 
  const requestOptions={
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body : JSON.stringify(partner)
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      let message = ''
      switch (error.field) {
        case 'email':
          switch (error.code) {
            case 'existing_email':
              message = "Un compte partenaire existe avec cette addresse email"
              break;
            default: message = 'Une erreur est survenue !'
          }
          break;
        case 'phoneNumber':
          switch (error.code) {
            case 'existing_phoneNumber' : 
            message = "Un compte partenaire existe avec ce numéro de téléphone"
            break;
            case 'invalid_phone_number' :
            message = "Numéro de téléphone invalide"
            break;
            default: message = 'Une erreur est survenue !'
          }
          break;
        default:
          message = 'Une erreur est survenue !'
      }
      throw message
    })
}

function updatePartnerStatus(auth, id, status){
  const requestUrl = `${apiConstants.URL}/partner/update_status/${id}`
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