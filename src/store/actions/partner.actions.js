import {partnerService} from 'services';
import {partnerConstants} from 'store/constants';

export const partnerActions= {
  getPartners,
  addPartner,
  updatePartner,
  updatePartnerStatus
}

function getPartners(auth){
  return dispatch => {
    return partnerService.getPartners(auth).then(partners=>{
      dispatch({ type: partnerConstants.GET_PARTNERS, partners })
      return partners;
    })
  }
}

function addPartner(auth, partner){
  return dispatch => {
    return partnerService.addPartner(auth, partner).then(partner=>{
      dispatch({ type: partnerConstants.ADD_PARTNER, partner })
      return partner;
    })
  }
}

function updatePartner(auth, id, partner){
  return dispatch => {
    return partnerService.updatePartner(auth, id, partner).then((partner)=>{
      dispatch({ type: partnerConstants.UPDATE_PARTNER, partner })
      return partner
    })
  }
}

function updatePartnerStatus(auth, id, status){
  return dispatch => {
    return partnerService.updatePartnerStatus(auth, id, status).then((partner)=>{
      dispatch({ type: partnerConstants.UPDATE_PARTNER, partner })
      return partner
    })
  }
}
