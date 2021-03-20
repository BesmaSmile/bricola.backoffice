import React, { useEffect } from 'react';
import CompaniesList from 'components/mains/Companies/CompaniesList';
import { companyActions, paymentActions, serviceActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import './Companies.scss';

const Companies = (props) => {
  const companiesRequest = hooks.useRequest()

  useEffect(() => {
    if (!props.companies) {
      loadCompanies()
    }
    if (!props.services) {
      props.getServices(props.auth)
    }
    // eslint-disable-next-line
  }, [])

  const loadCompanies = () => {
    companiesRequest.execute({
      action: () => props.getCompanies(props.auth)
    })
  }

  return (
    <div className='Companies relw100'>
      <div className='mar30'>
        <CompaniesList companies={props.companies}
          services={props.services}
          loading={companiesRequest.pending}
          error={companiesRequest.error}
          updateCompanyStatus={(id, status) => props.updateCompanyStatus(props.auth, id, status)}
          updateCompany={(id, company) => props.updateCompany(props.auth, id, company)}
          addCompany={(company) => props.addCompany(props.auth, company)}
          addPayment={(payment) => props.addPayment(props.auth, payment)}
          reload={loadCompanies} />
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  companies: state.company.companies,
  services: state.service.services,
})

const actionCreators = {
  getCompanies: companyActions.getCompanies,
  getServices: serviceActions.getServices,
  addCompany: companyActions.addCompany,
  updateCompanyStatus: companyActions.updateCompanyStatus,
  updateCompany: companyActions.updateCompany,
  addPayment: paymentActions.addPayment,
}

export default connect(mapState, actionCreators)(Companies);