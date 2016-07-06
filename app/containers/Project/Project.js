import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'redux-devshare'
import Workspace from '../Workspace/Workspace'

import './Project.scss'

class Project extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    username: PropTypes.string,
    name: PropTypes.string,
    account: PropTypes.object,
    project: PropTypes.string,
    projects: PropTypes.array,
    getProjects: PropTypes.func,
    getProject: PropTypes.func
  }

  componentWillMount () {
    const { account, projects, username, name } = this.props
    if (account.username && !projects && username !== 'anon') {
      // Load all projects if user is logged in
      return this.props.getProjects(account.username)
    }
    // Load only single project if user is not logged in
    this.props.getProject(username, name)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.account.username && (this.props.account.username !== nextProps.account.username)) {
      this.props.getProjects(nextProps.account.username)
    }
  }

  selectProject = proj => {
    if (proj.owner) {
      this.context.router.push(`/${proj.owner.username}/${proj.name}`)
    }
  }

  render () {
    return (
      <div className='Project'>
        <Workspace
          project={this.props.project}
          showButtons
          onProjectSelect={this.selectProject}
        />
      </div>
    )
  }
}

// Place state of redux store into props of component
const mapStateToProps = ({ router, entities, account }) => {
  const pathname = decodeURIComponent(router.location.pathname)
  const username = pathname.split('/')[1]
  const name = pathname.split('/')[2]
  const key = username ? `${username}/${name}` : name
  const project = (entities && entities.projects && entities.projects[key])
    ? entities.projects[key]
    : { owner: { username }, name }
  return {
    username,
    name,
    project,
    account,
    router
  }
}

// Place action methods into props
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(Actions.projects, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Project)
