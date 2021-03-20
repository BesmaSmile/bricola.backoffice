import {orderService} from 'services';
import {orderConstants} from 'store/constants';

export const orderActions= {
  getOrders,
  cancelOrder,
}

function getOrders(auth){
  return dispatch => {
    return orderService.getOrders(auth).then(orders=>{
      dispatch({ type: orderConstants.GET_ORDERS, orders })
      return orders;
    })
  }
}

function cancelOrder(auth, id) {
  return dispatch => {
    return orderService.cancelOrder(auth, id).then(order=>{
      dispatch({ type: orderConstants.CANCEL_ORDER, order })
      return order;
    })
  }
}