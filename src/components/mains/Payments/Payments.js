import React, { useEffect } from 'react';
import PaymentsList from 'components/mains/Payments/PaymentsList';
import { paymentActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import './Payments.scss';

const Payments = (props) => {
  const paymentsRequest = hooks.useRequest()
  
  useEffect(() => {
    if (!props.payments) {
      loadPayments()
    }
    // eslint-disable-next-line
  }, [])

  const loadPayments = () => {
    paymentsRequest.execute({
      action: ()=>props.getPayments(props.auth)
    })
  }

  return (
    <div className='Payments relw100'>
      <div className='mar30'>
        <PaymentsList payments={props.payments}
          auth={props.auth}
          loading={paymentsRequest.pending}
          error={paymentsRequest.error}
          reload={loadPayments}/>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  payments: state.payment.payments,
})

const actionCreators = {
  getPayments: paymentActions.getPayments,
}

export default connect(mapState, actionCreators)(Payments);