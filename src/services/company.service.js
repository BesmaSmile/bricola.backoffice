import { apiConstants } from 'consts'
import { handleResponse } from 'functions';

export const companyService = {
  getCompanies,
  addCompany,
  updateCompany,
  updateCompanyStatus,
}

function getCompanies(auth) {
  const requestUrl = `${apiConstants.URL}/company/get_all`
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
      throw 'Echec de chargement de la liste des entreprises !'
    });
}

function addCompany(auth, company) {
  const requestUrl = `${apiConstants.URL}/company/add`
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company)
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

function updateCompany(auth, id, companyInfos) {
  const requestUrl = `${apiConstants.URL}/company/update/${id}`
  const requestOptions = {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyInfos)
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}

function updateCompanyStatus(auth, id, status) {
  const requestUrl = `${apiConstants.URL}/company/update_status/${id}`
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