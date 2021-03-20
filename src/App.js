import React, { useState, useEffect } from 'react';
import LoginPage from 'pages/login';
import MainPage from 'pages/main';
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { userActions } from 'store/actions';

const App = (props) => {
  const { auth, getUserInfos } = props
  const [_loading, _setLoading] = useState(!auth)

  useEffect(() => {
    if (auth) {
      getUserInfos(auth).then(()=>_setLoading(false))
    } else {
      _setLoading(false)
    }
  }, [auth])
  
  return (
    <>
      {
        _loading ? <div className='relh100vh flex col jcc aic'>Chargement de l'application...</div>
          : <Switch>
            <Route exact path="/">
              {auth ? <Redirect to="/dashboard" />
                : <Redirect to="/login" />
              }
            </Route>
            {!auth && <Route to="/login" component={LoginPage} />}
            <MainPage />
          </Switch>
      }
    </>
  )
}
const mapState = (state) => ({
  auth: state.user.auth
})

const actionCreators = {
  getUserInfos: userActions.getUserInfos,
}

export default connect(mapState, actionCreators)(App);


