import { toArray } from 'lodash'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import TextField from 'material-ui/lib/text-field'
import Dialog from 'material-ui/lib/dialog'
import ProjectTile from '../../components/ProjectTile/ProjectTile'
import NewProjectTile from '../../components/NewProjectTile/NewProjectTile'
import NewProjectDialog from '../../components/NewProjectDialog/NewProjectDialog'
import SharingDialog from '../../components/SharingDialog/SharingDialog'
const Grout = typeof window !== 'undefined' ? require('kyper-grout') : undefined
import { Actions } from 'redux-grout'

import './Projects.scss'

class Projects extends Component {
  constructor (props) {
    super(props)
  }

  state = {
    addCollabModal: false,
    newProjectModal: false
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    this.props.getProjects(this.props.username)
  }

  collabClick = (user) => {
    this.context.router.push(`/${user.username}`)
  }

  toggleModal = (name) => {
    let newState = {}
    newState[`${name}Modal`] = !this.state[`${name}Modal`] || false
    this.setState(newState)
  }

  newSubmit = (name) => {
    this.props.addProject(name, this.props.username)
  }

  openProject = (project) => {
    this.context.router.push(`/${project.owner.username}/${project.name}`)
  }

  collaboratorClick = (collaborator) => {
    this.props.history.pushState(null, `/${collaborator.username}`)
  }

  searchUsers = (q, cb) => {
    const grout = new Grout()
    grout.Users.search(q).then(usersList => cb(null, usersList), err => cb(err))
  }

  addCollabClick = currentProject => {
    this.setState({ currentProject })
    this.toggleModal('addCollab')
  }

  addCollaborator = username => {
    this.props.addCollaborator(this.state.currentProject, username)
  }

  removeCollaborator = username => {
    this.props.removeCollaborator(this.state.currentProject, username)
  }

  removeProject = project => {
    this.props.deleteProject(project)
  }

  render () {
    let projects = this.props.projects ? this.props.projects.map((project, i) => {
      return (
        <ProjectTile
          key={`${project.name}-Collab-${i}`}
          project={ project }
          onCollabClick={ this.collabClick }
          onAddCollabClick={ this.addCollabClick.bind(this, project) }
          onSelect={ this.openProject }
          onDelete={ this.props.deleteProject }
        />
      )
    }) : <span>No projects yet</span>

    // If username doesn't match route then hide add project tile
    if (this.props.account.username === this.props.username) {
      projects.unshift((
        <NewProjectTile
          key="Project-New"
          onClick={ this.toggleModal.bind(this, 'newProject') }
        />
      ))
    }

    return (
      <div className="Projects">
        <div className="Projects-Tiles">
          { projects }
        </div>
        {
          this.state.newProjectModal ?
          <NewProjectDialog
            open={ this.state.newProjectModal }
            onRequestClose={ this.toggleModal.bind(this, 'newProject') }
            onCreateClick={ this.newSubmit }
          /> : null
        }
        {
          (this.state.currentProject && this.state.addCollabModal) ?
          <SharingDialog
            project={ this.state.currentProject }
            modalOpen={ this.state.addCollabModal }
            toggleModal={ this.toggleModal.bind(this, 'addCollab') }
            onUserSearch={ this.searchUsers }
            onAddCollab={ this.addCollaborator }
            onRemoveCollab={ this.removeCollaborator }
          /> : null
        }
      </div>
    )
  }
}

// Place state of redux store into props of component
function mapStateToProps (state) {
  const {
    entities: { projects }
  } = state
  const projectsArray = toArray(projects)
  const username = state.router.location.pathname.split('/')[1]
  return {
    account: state.account,
    projects: projectsArray,
    router: state.router,
    username
  }
}

// Place action methods into props
function mapDispatchToProps (dispatch) {
  return bindActionCreators(Actions.projects, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
