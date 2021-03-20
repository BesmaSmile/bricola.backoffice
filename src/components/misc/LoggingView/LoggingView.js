import React, { useEffect } from 'react';
import { hooks } from 'functions';
import TableList from 'components/misc/TableList/TableList';
import { format } from 'date-fns';
import { loggingActions } from 'store/actions';
import { connect } from 'react-redux';
import _ from 'lodash';
import './LoggingView.scss';

const LoggingView = (props) => {
  const { auth, id, actions, getLogging, creatonTitle } = props
  const loggingRequest = hooks.useRequest()

  const actionNames = {
    created: creatonTitle, 
    updated: 'Mise à jour des informations', 
    closed:'Clôture de la réclamation', 
    commented: 'Ajout d\'un commentaire',
    payement:'Paiement',
    enabled: 'Activation du compte',
    disabled:'Désactivation du compte', 
    updated_password: 'Changement du mot de passe',
    updated_permissions: 'Mise à jour des permissions',
  }

  useEffect(() => {
    if (!actions) {
      loadLogging()
    }
    // eslint-disable-next-line
  }, [])

  const loadLogging = () => {
    loggingRequest.execute({
      action: () => getLogging(auth, id)
    })
  }
  const columns = [
    { key: 'action', name: 'Action' },
    { key: 'at', name: 'Date' },
    { key: 'by', name: 'Par' },
  ]

  const rows = _.get(props, 'actions', []).map(action => {
    return {
      action: { value: action.name, render: <div className='lg-loggingCell'>{actionNames[action.name]}</div> },
      at: { value: format(new Date(action.at), 'dd/MM/yyy HH:mm'), render: <div className='lg-smallCell'>{format(new Date(action.at), 'dd/MM/yyy HH:mm')}</div> },
      by: {
        render:
          <div>
            <div className='lg-loggingCell'>{action.by.firstname} {action.by.lastname}</div>
            <div className='lg-smallCell'>{action.by.email}</div>
          </div>
      },

    }
  })
  return (
    <div className='LoggingView w450 flex'>
      <div className='mar20 relw100'>
        <TableList title='Historique des actions'
          subTitle={`${_.get(props, 'actions.length', '--')} action(s)`}
          columns={columns}
          rows={rows}
          // filters={filters}
          withRefresh={true}
          onRefresh={loadLogging}
          loading={loggingRequest.pending}
          error={loggingRequest.error} />
      </div>
    </div>
  )
}

const mapState = (state, props) => ({
  auth: state.user.auth,
  actions: state.logging.logging[props.id],
})

const actionCreators = {
  getLogging: loggingActions.getLogging,
}

export default connect(mapState, actionCreators)(LoggingView);