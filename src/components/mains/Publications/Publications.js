import React, { useEffect } from 'react';
import PublicationsList from 'components/mains/Publications/PublicationsList';
import { publicationActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import './Publications.scss';

const Publications = (props) => {
  const publicationsRequest = hooks.useRequest()

  useEffect(() => {
    if (!props.publications) {
      loadPublications()
    }
    // eslint-disable-next-line
  }, [])

  const loadPublications = () => {
    publicationsRequest.execute({
      action: ()=>props.getPublications(props.auth)
    })
  }

  return (
    <div className='Publications relw100'>
      <div className='mar30'>
        <PublicationsList publications={props.publications}
          loading={publicationsRequest.pending}
          error={publicationsRequest.error}
          addPublication={(publication)=>props.addPublication(props.auth, publication)}
          removePublication={(id) =>props.removePublication(props.auth, id)}
          reload={loadPublications}/>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  auth: state.user.auth,
  publications: state.publication.publications
})

const actionCreators = {
  getPublications: publicationActions.getPublications,
  addPublication: publicationActions.addPublication,
  removePublication: publicationActions.removePublication,
}

export default connect(mapState, actionCreators)(Publications);