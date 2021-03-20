import React, { useEffect } from 'react';
import ServicesList from 'components/mains/Services/ServicesList';
import { serviceActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import './Services.scss';

const Services = (props) => {
  const servicesRequest = hooks.useRequest()

  useEffect(() => {
    if (!props.services) {
      loadServices()
    }
    // eslint-disable-next-line
  }, [])

  const loadServices = () => {
    servicesRequest.execute({
      action: ()=>props.getServices(props.auth)
    })
  }

  return (
    <div className='Services relw100'>
      <div className='mar30'>
        <ServicesList services={props.services}
          loading={servicesRequest.pending}
          error={servicesRequest.error}
          updateService={(id, service)=>props.updateService(props.auth, id, service)}
          addService={(service)=>props.addService(props.auth, service)}
          reload={loadServices}/>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  services: state.service.services
})

const actionCreators = {
  getServices: serviceActions.getServices,
  addService: serviceActions.addService,
  updateService: serviceActions.updateService
}

export default connect(mapState, actionCreators)(Services);