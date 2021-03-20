import {apiConstants} from 'consts';
import {handleResponse} from 'functions';

export const userService={
  login,
  getUserInfos,
}

function login(user){
  const options={
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({...user, role : 'Admin'})
  }
  return fetch(`${apiConstants.URL}/user/login`, options)
  .then(handleResponse)
  .catch(error => {
    console.log(error)
    let message = ''
    switch (error.field) {
      case 'email':
        switch (error.code) {
          case 'invalid_email':
            message = 'Email invalide'
            break;
        }
        break;
      default:
        switch (error.code) {
          case 'incorrect_credentials':
            message = 'Email ou mot de passe incorrecte'
            break;
          case 'disabled_account' :
            message="Votre compte a été désactivé. Contacter un admin pour plus de détails !"
            break;
          default:
            message = 'Une erreur est survenue !'
        }
    }
    throw message
  })
}

function getUserInfos(auth){
  const options={
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${auth.token}`,
    },
  }
  return fetch(`${apiConstants.URL}/user/get_infos`, options)
  .then(handleResponse)
  .catch(error => {
    console.log(error)
    throw 'Echec de chargement de vos données !'
  })
}