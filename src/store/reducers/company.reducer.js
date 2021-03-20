import {companyConstants, paymentConstants} from 'store/constants';

export function company(state = {}, action) {
  switch(action.type) {
    case companyConstants.GET_COMPANIES :
    return {
        ...state,
        companies : action.companies
    }
    case companyConstants.ADD_COMPANY :
    return {
        ...state,
        companies : [action.company,...state.companies]
    }
    case companyConstants.UPDATE_COMPANY :
    return {
      ...state,
      companies : state.companies.map(company=>
        company._id===action.company._id ? action.company : company)
    }
    case paymentConstants.ADD_PAYMENT :
      if(action.payment.company) {
        return {
          ...state,
          companies : state.companies.map(company=>
            company._id===action.payment.company._id ? {
              ...company,
              totalPayments: company.totalPayments + action.payment.amount,
              toPay: company.toPay - action.payment.amount,
            } : company),
        }
      }
      return state;
    default :
    return state
  }
}
