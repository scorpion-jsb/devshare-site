import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash'
import { firebaseConnect, dataToJS, isLoaded } from 'react-redux-firebase'
import devshare from 'devshare'
import RaisedButton from 'material-ui/RaisedButton'
import LoadingSpinner from 'components/LoadingSpinner'

@firebaseConnect([
  'templates#limitToFirst=40'
])
@connect(
  ({ firebase }) => ({
    templates: dataToJS(firebase, 'templates')
  })
)
export default class TemplatesContainer extends Component {
  static propTypes = {
    templates: PropTypes.object
  }

  addTemplate = () => devshare.project('prescottprue', 'reactBasic')
      .copyToTemplate('reactBasic')
      .then(() => {
        console.log('template added successfully')
      })
      .catch((err) => {
        console.error('error:', err)
      })

  render () {
    if (!isLoaded(this.props.templates)) {
      return <LoadingSpinner />
    }

    return (
      <div className='flex-column-center'>
        <RaisedButton
          label='Add Template'
          onTouchTap={this.addTemplate}
        />
        <div>
          {
            map(this.props.templates, (t, i) =>
              <div key={`Template-${i}`}>
                <pre>{JSON.stringify(t, null, 2)}</pre>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
