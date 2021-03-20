import {apiConstants} from 'consts'
import {handleResponse} from 'functions';


export const referentialService={
  getProvinces,
}

function getProvinces(){
  const requestUrl =`${apiConstants.URL}/public/provinces` 
  return fetch(requestUrl)
    .then(handleResponse)
    .catch(error=>{
      console.log(error);
      throw 'Echec de chargement de la liste des wilayas !'
    });
}