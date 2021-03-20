import React, { useEffect } from 'react';
import OrdersList from 'components/mains/Orders/OrdersList';
import { orderActions, reclamationActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import _ from 'lodash';
import './Orders.scss';

const Orders = (props) => {
  const ordersRequest = hooks.useRequest()
  const orders = props.orders?.map(order=>{
    let reduction, toPay;
    if(order.cost?.variable){
      reduction = 0;
      const cost = Object.values(order.cost)
      .filter(price => price)
      .reduce((p1, p2) => p1 + p2, 0)
      if(order.promoCode ) {
        if(order.promoCode.unity === 'amount'){
          reduction =Math.min( order.promoCode.reduction, cost)
        }
        else {
          reduction =Math.round(cost * order.promoCode.reduction/100)
        }
      }
      toPay = Math.max(0, cost - (reduction || 0))
    }
    return {
      ...order,
      reduction,
      toPay
    }
  })
  useEffect(() => {
    if (!props.orders) {
      loadOrders()
    }
    // eslint-disable-next-line
  }, [])

  const loadOrders = () => {
    ordersRequest.execute({
      action: ()=>props.getOrders(props.auth)
    })
  }

  return (
    <div className='Orders relw100'>
      <div className='mar30'>
        <OrdersList orders={orders}
          commissionPermission={props.commissionPermission}
          cancelOrder={(id) => props.cancelOrder(props.auth, id)}
          auth={props.auth}
          loading={ordersRequest.pending}
          error={ordersRequest.error}
          reload={loadOrders}
          addReclamation={(id, comment)=>props.addReclamation(props.auth, id, comment)}/>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  orders: state.order.orders,
  commissionPermission : _.get(state.user, 'user.permissions.commissions', false),
})

const actionCreators = {
  getOrders: orderActions.getOrders,
  cancelOrder: orderActions.cancelOrder,
  addReclamation: reclamationActions.addReclamation,
}

export default connect(mapState, actionCreators)(Orders);