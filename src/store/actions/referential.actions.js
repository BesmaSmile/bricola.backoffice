import {referentialService} from 'services';
import {referentialConstants} from 'store/constants';

export const referentialActions= {
  getProvinces
}

function getProvinces(provinces){
  return dispatch => {
    return referentialService.getProvinces().then(result=>{
      dispatch({ type: referentialConstants.GET_PROVINCES, provinces : result.provinces })
      return result.provinces
    })
  }
}