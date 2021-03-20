import {adminService} from 'services';
import {adminConstants} from 'store/constants';

export const adminActions= {
  getAdmins,
  addAdmin,
  updateAdminStatus,
  updateAdminPermissions
}

function getAdmins(auth){
  return dispatch => {
    return adminService.getAdmins(auth).then(admins=>{
      dispatch({ type: adminConstants.GET_ADMINS, admins })
      return admins;
    })
  }
}

function addAdmin(auth, admin){
  return dispatch => {
    return adminService.addAdmin(auth, admin).then(admin=>{
      dispatch({ type: adminConstants.ADD_ADMIN, admin })
      return admin;
    })
  }
}

function updateAdminStatus(auth, id, status){
  return dispatch => {
    return adminService.updateAdminStatus(auth, id, status).then((admin)=>{
      dispatch({ type: adminConstants.UPDATE_ADMIN, admin })
      return admin
    })
  }
}

function updateAdminPermissions(auth, id, permissions){
  return dispatch => {
    return adminService.updateAdminPermissions(auth, id, permissions).then((admin)=>{
      dispatch({ type: adminConstants.UPDATE_ADMIN, admin })
      return admin
    })
  }
}
