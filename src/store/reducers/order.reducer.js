import { orderConstants, reclamationConstants } from 'store/constants';

export function order(state = {}, action) {
  switch (action.type) {
    case orderConstants.GET_ORDERS:
      return {
        ...state,
        orders: action.orders
      }
    case orderConstants.CANCEL_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>order._id === action.order._id ? action.order : order),
      }
    case reclamationConstants.ADD_RECLAMATION:
      return {
        ...state,
        orders: state.orders.map(order => order._id === action.id ? ({ ...order, reclamation: action.reclamation._id }) : order)
      }
    default:
      return state
  }
}
