import {partnerConstants, paymentConstants} from 'store/constants';

export function partner(state = {}, action) {
  switch(action.type) {
    case partnerConstants.GET_PARTNERS :
    return {
        ...state,
        partners : action.partners
    }
    case partnerConstants.ADD_PARTNER :
    return {
        ...state,
        partners : [action.partner,...state.partners]
    }
    case partnerConstants.UPDATE_PARTNER :
    return {
      ...state,
      partners : state.partners.map(partner=>
        partner._id===action.partner._id ? action.partner : partner)
    }
    case paymentConstants.ADD_PAYMENT :
      if(action.payment.partner) {
        return {
          ...state,
          partners : state.partners.map(partner=>
            partner._id===action.payment.partner._id ? {
              ...partner,
              totalPayments: partner.totalPayments + action.payment.amount,
              toPay: partner.toPay - action.payment.amount,
            } : partner)
        }
      }
      return state;
    default :
    return state
  }
}
