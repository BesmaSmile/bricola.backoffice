import {userService} from 'services';
import {userConstants} from 'store/constants';

export const userActions= {
  login,
  logout,
  getUserInfos,
}

function login(user){
  return dispatch => {
    return userService.login(user).then(auth=>{
      dispatch({ type: userConstants.LOGGED_IN, auth })
      return auth
    })
  }
}

function logout(){
  return dispatch => {
    dispatch({ type: userConstants.LOGGED_OUT })
  }
}

function getUserInfos(auth){
  return dispatch => {
    return userService.getUserInfos(auth).then(user=>{
      dispatch({ type: userConstants.GET_USER_INFOS, user })
      return user
    })
  }
}