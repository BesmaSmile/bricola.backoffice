import React, { useEffect } from 'react';
import PartnersList from 'components/mains/Partners/PartnersList';
import { partnerActions, companyActions, serviceActions, referentialActions, paymentActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import _ from 'lodash';
import './Partners.scss';

const Partners = (props) => {
  const partnersRequest = hooks.useRequest()
  useEffect(() => {
    if (!props.partners) {
      loadPartners()
    }
    if (!props.provinces) {
      props.getProvinces()
    }
    if(!props.companies){
      props.getCompanies(props.auth)
    }
    if(!props.services){
      props.getServices(props.auth)
    }
    // eslint-disable-next-line
  }, [])

  const loadPartners = () => {
    partnersRequest.execute({
      action: ()=>props.getPartners(props.auth)
    })
  }

  return (
    <div className='Partners relw100'>
      <div className='mar30'>
        <PartnersList partners={props.partners}
          loading={partnersRequest.pending}
          error={partnersRequest.error}
          updatePartnerStatus={(id, status)=>props.updatePartnerStatus(props.auth, id, status)} 
          addPartner={(partner)=>props.addPartner(props.auth, partner)}
          updatePartner={(id,partner)=>props.updatePartner(props.auth, id, partner)}
          addPayment={(payment) => props.addPayment(props.auth, payment)}
          reload={loadPartners}
          provinces={props.provinces}
          companies={props.companies}
          services={props.services}/>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  partners: state.partner.partners,
  provinces : state.referential.provinces,
  companies : state.company.companies,
  services: state.service.services,
})

const actionCreators = {
  getPartners: partnerActions.getPartners,
  addPartner: partnerActions.addPartner,
  updatePartner: partnerActions.updatePartner,
  updatePartnerStatus: partnerActions.updatePartnerStatus,
  getProvinces : referentialActions.getProvinces,
  getCompanies: companyActions.getCompanies,
  getServices: serviceActions.getServices,
  addPayment: paymentActions.addPayment,
}

export default connect(mapState, actionCreators)(Partners);