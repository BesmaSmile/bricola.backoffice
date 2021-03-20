import {paymentConstants} from 'store/constants';

export function payment(state = {}, action) {
  switch(action.type) {
    case paymentConstants.GET_PAYMENTS :
    return {
        ...state,
        payments : action.payments
    }
    case paymentConstants.ADD_PAYMENT :
    return {
        ...state,
        payments : state.payments && [action.payment,...state.payments]
    }
    default :
    return state
  }
}
