import React, {Component, PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'redux-devshare'
import { users } from 'devshare'

import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import { List, ListItem } from 'material-ui/List'
import AutoComplete from 'material-ui/AutoComplete'
import Avatar from 'material-ui/Avatar'
import PersonIcon from 'material-ui/svg-icons/social/person'
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle'
import Colors from 'material-ui/styles/colors'
import './SharingDialog.scss'

export default class SharingDialog extends Component {
  constructor () {
    super()
    const { projects, projectKey } = this.props
    this.state = {
      project: projects[projectKey] || {},
      collaborators: projects[projectKey] ? projects[projectKey].collaborators : [],
      error: null
    }
  }

  static propTypes = {
    projects: PropTypes.object,
    projectKey: PropTypes.string.isRequired,
    open: PropTypes.bool,
    error: PropTypes.object,
    onRequestClose: PropTypes.func,
    addCollaborator: PropTypes.func.isRequired,
    removeCollaborator: PropTypes.func.isRequired
  }

  componentDidMount () {
    const project = this.props.projects[this.props.projectKey]
    this.setState({
      collaborators: project ? project.collaborators : []
    })
  }

  componentWillReceiveProps (nextProps) {
    // console.log('component recieve props', nextProps)
    if (nextProps.open) {
      this.setState({
        open: nextProps.open
      })
    }

    if (nextProps.projectKey) {
      const project = nextProps.projects[nextProps.projectKey]
      this.setState({
        project,
        collaborators: project ? project.collaborators : []
      })
    }
  }

  searchAccounts = q =>
    users()
      .search(q)
      .then(matchingUsers => this.setState({ matchingUsers }))
      .catch(error => this.setState({ error }))

  selectNewCollab = username => {
    this.props.addCollaborator(this.state.project, username)
    this.setState({ searchText: null })
  }

  removeCollab = ind => {
    this.props.removeCollaborator(this.state.project, this.state.collaborators[ind].username)
    this.setState({
      collaborators: this.state.collaborators.splice(ind, 1)
    })
  }

  close = () => {
    this.setState({
      searchText: null
    })
    this.props.onRequestClose()
  }

  render () {
    const collabsList = this.state.collaborators ? this.state.collaborators.map((collaborator, i) => {
      const { image, username } = collaborator
      return (
        <div key={`${this.props.projectKey}-Collab-${i}`}>
          <ListItem
            leftAvatar={
              <Avatar
                icon={<PersonIcon />}
                src={(image && image.url) ? image.url : null}
              />
            }
            rightIcon={
              <RemoveIcon
                color={Colors.red500}
                hoverColor={Colors.red800}
                onClick={this.removeCollab.bind(this, i)}
              />
            }
            primaryText={username}
            secondaryText='Read, Write'
          />
        </div>
      )
    }) : null

    const actions = [
      <FlatButton
        label='Close'
        secondary
        onClick={this.props.onRequestClose}
        onTouchTap={this.props.onRequestClose}
      />
    ]

    const matchingUsernames = this.state.matchingUsers
      ? this.state.matchingUsers.map(account =>
          account.username ? account.username : account
        )
      : []

    return (
      <Dialog
        {...this.props}
        title='Sharing'
        actions={actions}
        modal={false}
        bodyClassName='SharingDialog-Content'
        titleClassName='SharingDialog-Content-Title'
        contentClassName='SharingDialog'
      >
        {
          this.props.error
          ? (
            <div className='SharingDialog-Error'>
              <span>{this.props.error}</span>
            </div>
          )
          : null
        }
        {
          collabsList
            ? (
            <List>
              {collabsList}
            </List>
            )
            : (
            <div className='SharingDialog-No-Collabs'>
              <span>No current collaborators</span>
            </div>
            )
        }
        <div className='SharingDialog-AutoComplete-Container'>
          <AutoComplete
            className='SharingDialog-Autocomplete'
            hintText='Search users to add'
            floatingLabelText='Search users to add'
            fullWidth
            searchText={this.state.searchText}
            dataSource={matchingUsernames}
            onUpdateInput={this.searchAccounts}
            onNewRequest={this.selectNewCollab}
          />
        </div>
      </Dialog>
    )
  }
}
// Place state of redux store into props of component
const mapStateToProps = (state) => {
  const projects = (state.entities && state.entities.projects)
    ? state.entities.projects
    : {}
  return {
    projects,
    error: state.projects.error || null,
    account: state.account,
    router: state.router
  }
}

// Place action methods into props
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(Actions.projects, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SharingDialog)
