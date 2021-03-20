import React, { useEffect } from 'react';
import PromoCodesList from 'components/mains/PromoCodes/PromoCodesList';
import { promoCodeActions, serviceActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import './PromoCodes.scss';

const PromoCodes = (props) => {
  const promoCodesRequest = hooks.useRequest()

  useEffect(() => {
    if (!props.promoCodes) {
      loadPromoCodes()
    }
    if (!props.services) {
      props.getServices(props.auth)
    }
    // eslint-disable-next-line
  }, [])

  const loadPromoCodes = () => {
    promoCodesRequest.execute({
      action: ()=>props.getPromoCodes(props.auth)
    })
  }

  return (
    <div className='PromoCodes relw100'>
      <div className='mar30'>
        <PromoCodesList promoCodes={props.promoCodes}
          loading={promoCodesRequest.pending}
          error={promoCodesRequest.error}
          addPromoCode={(promoCode)=>props.addPromoCode(props.auth, promoCode)}
          reload={loadPromoCodes}
          services={props.services}/>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  promoCodes: state.promoCode.promoCodes,
  services: state.service.services,
})

const actionCreators = {
  getPromoCodes: promoCodeActions.getPromoCodes,
  addPromoCode: promoCodeActions.addPromoCode,
  getServices: serviceActions.getServices,
}

export default connect(mapState, actionCreators)(PromoCodes);