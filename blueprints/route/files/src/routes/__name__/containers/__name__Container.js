import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pathToJS, firebaseConnect } from 'react-redux-firebase'
import <%= pascalEntityName %> from '../components/<%= pascalEntityName %>'

@firebaseConnect(
  ({ params }) => ([
    '<%= pascalEntityName %>'
  ])
)
@connect(
  ({ firebase }) => ({
    <%= pascalEntityName %>: dataToJS(firebase, '<%= pascalEntityName %>')
  })
)
export default class <%= pascalEntityName %>Container extends Component {
  static propTypes = {
    <%= pascalEntityName %>: PropTypes.object
  }

  render() {
    return (
      <<%= pascalEntityName %> />
    )
  }
}
