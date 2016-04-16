import { find, map, toArray } from 'lodash'
import React, {Component, PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Actions } from 'redux-devshare'
import { users } from 'devshare'

import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import AutoComplete from 'material-ui/lib/auto-complete'
import Avatar from 'material-ui/lib/avatar'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import RemoveIcon from 'material-ui/lib/svg-icons/content/remove-circle'
import Colors from 'material-ui/lib/styles/colors'
import './SharingDialog.scss'

const user = {
  image: {
    url: null
  }
}

export default class SharingDialog extends Component {
  constructor (props){
    super(props)
  }

  state = {
    open: this.props.open || false,
    project: this.props.projects[this.props.projectKey] || {},
    collaborators: this.props.projects[this.props.projectKey] ? this.props.projects[this.props.projectKey].collaborators : [],
    error: null
  }

  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    open: PropTypes.bool
  }

  componentDidMount () {
    const project = this.props.projects[this.props.projectKey]
    this.setState({
      collaborators: project ? project.collaborators : []
    })
  }

  componentWillReceiveProps (nextProps) {
    // if (nextProps.open) {
    //   this.setState({
    //     open: nextProps.open
    //   })
    // }

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

  close = () =>
    this.setState({
      searchText: null,
      open: false
    })

  render () {
    const collabsList = this.state.collaborators ? this.state.collaborators.map((collaborator, i) => {
      const { image, username } = collaborator
      return (
        <div key={`${this.props.projectKey}-Collab-${i}`}>
          <ListItem
            leftAvatar={
              <Avatar
                icon={ <PersonIcon /> }
                src={ (image && image.url) ? image.url : null }
              />
            }
            rightIcon={
              <RemoveIcon
                color={ Colors.red500 }
                hoverColor={ Colors.red800 }
                onClick={ this.removeCollab.bind(this, i) }
              />
            }
            primaryText={ username }
            secondaryText="Read, Write"
          />
        </div>
      )
    }) : null

    const actions = [
      <FlatButton
        label="Close"
        secondary={ true }
        onTouchTap={ this.close }
      />
    ]

    const matchingUsernames = this.state.matchingUsers
      ? this.state.matchingUsers.map(account =>
          account.username ? account.username : account
        )
      : []

    return (
      <Dialog
        title='Sharing'
        actions={ actions }
        modal={ false }
        open={ this.state.open }
        onRequestClose={ this.close }
        bodyClassName='SharingDialog-Content'
        titleClassName='SharingDialog-Content-Title'
        contentClassName='SharingDialog'
      >
      {
        this.props.error
        ? <div className="SharingDialog-Error">
            <span>{ this.props.error }</span>
          </div>
        : null
      }
        {
          collabsList
            ? <List>
                { collabsList }
              </List>
            : <div className="SharingDialog-No-Collabs">
                <span>No current collaborators</span>
              </div>
        }
        <div className="SharingDialog-AutoComplete-Container">
          <AutoComplete
            className="SharingDialog-Autocomplete"
            hintText="Search users to add"
            floatingLabelText="Search users to add"
            fullWidth={ true }
            searchText={ this.state.searchText }
            dataSource={ matchingUsernames }
            onUpdateInput={ this.searchAccounts }
            onNewRequest={ this.selectNewCollab }
          />
        </div>
      </Dialog>
    )
  }
}
// Place state of redux store into props of component
function mapStateToProps (state) {
  const projects =  (state.entities && state.entities.projects) ? state.entities.projects : {}
  return {
    projects,
    error: state.projects.error || null,
    account: state.account,
    router: state.router
  }
}

// Place action methods into props
function mapDispatchToProps (dispatch) {
  return bindActionCreators(Actions.projects, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SharingDialog)
