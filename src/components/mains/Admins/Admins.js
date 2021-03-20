import React, { useEffect } from 'react';
import AdminsList from 'components/mains/Admins/AdminsList';
import { adminActions } from 'store/actions';
import { adminService } from 'services';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import './Admins.scss';

const Admins = (props) => {
  const adminsRequest = hooks.useRequest()

  useEffect(() => {
    if (!props.admins) {
      loadAdmins()
    }
    // eslint-disable-next-line
  }, [])

  const loadAdmins = () => {
    adminsRequest.execute({
      action: ()=>props.getAdmins(props.auth)
    })
  }

  return (
    <div className='Admins relw100'>
      <div className='mar30'>
        <AdminsList admins={props.admins}
          loading={adminsRequest.pending}
          error={adminsRequest.error}
          updateAdminStatus={(id, status)=>props.updateAdminStatus(props.auth, id, status)} 
          updateAdminPermissions={(id, permissions)=>props.updateAdminPermissions(props.auth, id, permissions)}
          changeAdminPassword={(id, password)=>adminService.changeAdminPassword(props.auth, id, password)}
          addAdmin={(admin)=>props.addAdmin(props.auth, admin)}
          reload={loadAdmins}/>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  admins: state.admin.admins
})

const actionCreators = {
  getAdmins: adminActions.getAdmins,
  addAdmin: adminActions.addAdmin,
  updateAdminStatus: adminActions.updateAdminStatus,
  updateAdminPermissions: adminActions.updateAdminPermissions
}

export default connect(mapState, actionCreators)(Admins);