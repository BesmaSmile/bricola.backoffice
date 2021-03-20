import { apiConstants } from 'consts'
import { handleResponse } from 'functions';

export const adminService = {
  getAdmins,
  addAdmin,
  updateAdminStatus,
  updateAdminPermissions,
  changeAdminPassword
}

function getAdmins(auth) {
  const requestUrl = `${apiConstants.URL}/admin/get_all`
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
    .then(admins => admins.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)))
    .catch(error => {
      console.log(error);
      throw 'Echec de chargement de la liste des partenaires !'
    });
}

function addAdmin(auth, admin) {
  const requestUrl = `${apiConstants.URL}/admin/register`
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(admin)
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
              message = "Un compte admin existe avec cette addresse email"
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

function updateAdminStatus(auth, id, status) {
  const requestUrl = `${apiConstants.URL}/admin/update_status/${id}`
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

function updateAdminPermissions(auth, id, permissions) {
  const requestUrl = `${apiConstants.URL}/admin/update_permissions/${id}`
  const requestOptions = {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ permissions })
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}

function changeAdminPassword(auth, id, password) {
  const requestUrl = `${apiConstants.URL}/admin/change_password/${id}`
  const requestOptions = {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password })
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}