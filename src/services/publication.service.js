import { apiConstants } from 'consts'
import { handleResponse } from 'functions';

export const publicationService = {
  getPublications,
  addPublication,
  removePublication,
}

function getPublications(auth) {
  const requestUrl = `${apiConstants.URL}/publication/get_all`
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
    .then(publications => publications.sort((p1,p2)=>new Date(p2.createdAt) - new Date(p1.createdAt)))
    .catch(error => {
      console.log(error);
      throw 'Echec de chargement de la liste des publications !'
    });
}

function addPublication(auth, publicationInfos) {
  const requestUrl = `${apiConstants.URL}/publication/add`
  const formData = new FormData()
  formData.append('image', publicationInfos.image);
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json'
    },
    body: formData
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}

function removePublication(auth, publicationId) {
  const requestUrl = `${apiConstants.URL}/publication/remove/${publicationId}`
  const requestOptions = {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json'
    },
  }
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error)
      throw 'Une erreur est survenue !'
    })
}