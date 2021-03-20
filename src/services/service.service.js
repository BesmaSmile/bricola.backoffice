import { apiConstants } from 'consts'
import { handleResponse } from 'functions';

export const serviceService = {
  getServices,
  addService,
  updateService,
}

function getServices(auth) {
  const requestUrl = `${apiConstants.URL}/service/get_all`
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
    .then(services => services.sort((s1,s2)=>new Date(s2.createdAt) - new Date(s1.createdAt)))
    .catch(error => {
      console.log(error);
      throw 'Echec de chargement de la liste des services !'
    });
}

function addService(auth, serviceInfos) {
  const requestUrl = `${apiConstants.URL}/service/add`
  const formData = new FormData()
  formData.append('image', serviceInfos.image);
  formData.append('icon', serviceInfos.icon);
  formData.append('service', JSON.stringify(serviceInfos.service))
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
      let message = ''
      switch (error.field) {
        case 'name':
          switch (error.code) {
            case 'existing_name':
              message = "Un service existe avec ce nom"
              break;
          }
          break;
        default:
          message = 'Une erreur est survenue !'
      }
      throw message
    })
}

function updateService(auth, id, serviceInfos) {
  const requestUrl = `${apiConstants.URL}/service/update/${id}`
  const formData = new FormData()
  formData.append('image', serviceInfos.image);
  formData.append('icon', serviceInfos.icon);
  formData.append('service', JSON.stringify(serviceInfos.service))
  const requestOptions = {
    method: 'PUT',
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
