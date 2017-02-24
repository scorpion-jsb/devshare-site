import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { devshare, helpers } from 'redux-devshare'

import <%= pascalEntityName %> from '../components/<%= pascalEntityName %>/<%= pascalEntityName %>'

const { pathToJS, dataToJS } = helpers

const formName = <%= pascalEntityName %>

// Props decorators
@devshare(
  // List of Firbase refs to sync
  ({ params }) => ([
    '<%= pascalEntityName %>'
  ])
)
@connect(
  // Map state to props
  ({ firebase }, { params }) => ({
      account: pathToJS(firebase, 'profile'),
      <%= pascalEntityName %>: dataToJS(firebase, '<%= pascalEntityName %>')
    })
  })
)
export default class <%= pascalEntityName %>Container extends Component {
  static propTypes = {
    account: PropTypes.object,
    <%= pascalEntityName %>: PropTypes.object
  }

  render() {
    return (
      <<%= pascalEntityName %> />
    )
  }
}
