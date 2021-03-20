import {promoCodeService} from 'services';
import {promoCodeConstants} from 'store/constants';

export const promoCodeActions= {
  getPromoCodes,
  addPromoCode,
}

function getPromoCodes(auth){
  return dispatch => {
    return promoCodeService.getPromoCodes(auth).then(promoCodes=>{
      dispatch({ type: promoCodeConstants.GET_PROMO_CODES, promoCodes })
      return promoCodes;
    })
  }
}

function addPromoCode(auth, promoCode){
  return dispatch => {
    return promoCodeService.addPromoCode(auth, promoCode).then(promoCode=>{
      dispatch({ type: promoCodeConstants.ADD_PROMO_CODE, promoCode })
      return promoCode;
    })
  }
}