import {paymentService} from 'services';
import {paymentConstants} from 'store/constants';

export const paymentActions= {
  getPayments,
  addPayment,
}

function getPayments(auth){
  return dispatch => {
    return paymentService.getPayments(auth).then(payments=>{
      dispatch({ type: paymentConstants.GET_PAYMENTS, payments })
      return payments;
    })
  }
}

function addPayment(auth, payment){
  return dispatch => {
    return paymentService.addPayment(auth, payment).then(payment=>{
      dispatch({ type: paymentConstants.ADD_PAYMENT, payment })
      return payment;
    })
  }
}
