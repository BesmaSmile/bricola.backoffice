import {serviceService} from 'services';
import {serviceConstants} from 'store/constants';

export const serviceActions= {
  getServices,
  addService,
  updateService,
}

function getServices(auth){
  return dispatch => {
    return serviceService.getServices(auth).then(services=>{
      dispatch({ type: serviceConstants.GET_SERVICES, services })
      return services;
    })
  }
}

function addService(auth, service){
  return dispatch => {
    return serviceService.addService(auth, service).then(service=>{
      dispatch({ type: serviceConstants.ADD_SERVICE, service })
      return service;
    })
  }
}

function updateService(auth, id, serviceInfos){
  return dispatch => {
    return serviceService.updateService(auth, id, serviceInfos).then((service)=>{
      dispatch({ type: serviceConstants.UPDATE_SERVICE, service })
      return service
    })
  }
}