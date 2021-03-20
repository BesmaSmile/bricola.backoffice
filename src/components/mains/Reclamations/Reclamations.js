import React, { useEffect } from 'react';
import ReclamationsList from 'components/mains/Reclamations/ReclamationsList';
import { reclamationActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import './Reclamations.scss';

const Reclamations = (props) => {
  const reclamationsRequest = hooks.useRequest()

  useEffect(() => {
    if (!props.reclamations) {
      loadReclamations()
    }
    // eslint-disable-next-line
  }, [])

  const loadReclamations = () => {
    reclamationsRequest.execute({
      action: ()=>props.getReclamations(props.auth)
    })
  }

  return (
    <div className='Reclamations relw100'>
      <div className='mar30'>
        <ReclamationsList reclamations={props.reclamations}
          auth={props.auth}
          loading={reclamationsRequest.pending}
          error={reclamationsRequest.error}
          closeReclamation={(id)=>props.closeReclamation(props.auth, id)} 
          addComment={(id, comment)=>props.addComment(props.auth, id, comment)}
          reload={loadReclamations}/>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  reclamations: state.reclamation.reclamations,
})

const actionCreators = {
  addComment: reclamationActions.addComment,
  getReclamations: reclamationActions.getReclamations,
  closeReclamation: reclamationActions.closeReclamation,
}

export default connect(mapState, actionCreators)(Reclamations);