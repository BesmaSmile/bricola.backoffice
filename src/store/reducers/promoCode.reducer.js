import {promoCodeConstants} from 'store/constants';

export function promoCode(state = {}, action) {
  switch(action.type) {
    case promoCodeConstants.GET_PROMO_CODES :
    return {
        ...state,
        promoCodes : action.promoCodes
    }
    case promoCodeConstants.ADD_PROMO_CODE :
    return {
        ...state,
        promoCodes : [action.promoCode,...state.promoCodes]
    }
    default :
    return state
  }
}
