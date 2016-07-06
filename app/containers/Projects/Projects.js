import { toArray } from 'lodash'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'redux-devshare'

// Components
import ProjectTile from '../../components/ProjectTile/ProjectTile'
import NewProjectTile from '../../components/NewProjectTile/NewProjectTile'
import NewProjectDialog from '../../components/NewProjectDialog/NewProjectDialog'
import SharingDialog from '../SharingDialog/SharingDialog'

import './Projects.scss'

class Projects extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    username: PropTypes.string,
    account: PropTypes.object,
    projects: PropTypes.array,
    history: PropTypes.object,
    addProject: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
    getProjects: PropTypes.func.isRequired
  }

  state = {
    addCollabModal: false,
    newProjectModal: false
  }

  componentDidMount () {
    this.props.getProjects(this.props.username)
  }

  toggleModal = name => {
    let newState = {}
    newState[`${name}Modal`] = !this.state[`${name}Modal`] || false
    this.setState(newState)
  }

  newSubmit = name => {
    this.props.addProject(this.props.username, name)
    this.toggleModal('newProject')
  }

  openProject = project =>
    this.context.router.push(`/${project.owner.username}/${project.name}`)

  collaboratorClick = collaborator =>
    this.props.history.pushState(null, `/${collaborator.username}`)

  collabClick = user =>
    this.context.router.push(`/${user.username}`)

  addCollabClick = currentProject => {
    this.setState({ currentProject })
    this.toggleModal('addCollab')
  }

  deleteProject = project =>
    this.props.deleteProject(project.owner.username, project.name)

  render () {
    let projects = this.props.projects ? this.props.projects.map((project, i) => {
      return (
        <ProjectTile
          key={`${project.name}-Collab-${i}`}
          project={project}
          onCollabClick={this.collabClick}
          onAddCollabClick={this.addCollabClick.bind(this, project)}
          onSelect={this.openProject}
          onDelete={this.deleteProject}
        />
      )
    }) : <span>No projects yet</span>

    // If username doesn't match route then hide add project tile
    if (this.props.account.username === this.props.username) {
      projects.unshift((
        <NewProjectTile
          key='Project-New'
          onClick={this.toggleModal.bind(this, 'newProject')}
        />
      ))
    }
    return (
      <div className='Projects'>
        <div className='Projects-Tiles'>
          {projects}
        </div>
        {
          this.state.newProjectModal
          ? (
            <NewProjectDialog
              open={this.state.newProjectModal}
              onCreateClick={this.newSubmit}
            />
          ) : null
        }
        {
          (this.state.currentProject && this.state.addCollabModal)
          ? (
            <SharingDialog
              projectKey={`${this.state.currentProject.owner.username}/${this.state.currentProject.name}`}
              open={this.state.addCollabModal}
              onRequestClose={this.toggleModal.bind(this, 'addCollab')}
            />
          ) : null
        }
      </div>
    )
  }
}

// Place state of redux store into props of component
const mapStateToProps = (state) => {
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
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(Actions.projects, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Projects)
