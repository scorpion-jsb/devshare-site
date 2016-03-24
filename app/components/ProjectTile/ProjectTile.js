import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import Popover from 'material-ui/lib/popover/popover'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import PersonAddIcon from 'material-ui/lib/svg-icons/social/person-add'
import SettingsIcon from 'material-ui/lib/svg-icons/action/settings'
import ProjectSettingsDialog from '../ProjectSettingsDialog/ProjectSettingsDialog'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import DeleteDialog from '../DeleteDialog/DeleteDialog'
import './ProjectTile.scss'

const personIconStyle = { width: '50%', height: '65%' }
const avatarSize = 50
const hoverColor = '#03A9F4'

export default class ProjectTile extends Component {
  constructor (props){
    super(props)
  }

  state = { dropdownOpen: false, deleteOpen: false }

  static propTypes = {
    project: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onAddCollabClick: PropTypes.func,
    onCollabClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  state = { vimEnabled: false, settingsOpen: false }

  handleSelect = e => {
    e.preventDefault()
    this.props.onSelect(this.props.project)
  }

  toggleDropdown = e => {
    this.setState({
      anchorEl: e.currentTarget,
      dropdownOpen: !this.state.dropdownOpen,
      settingsOpen: false,
      deleteOpen: false
    })
  }

  handleDropdownClose = () => {
    this.setState({
      dropdownOpen: false,
      deleteOpen: false
    })
  }

  addClick = e => {
    e.preventDefault()
    if (this.props.onAddCollabClick) this.props.onAddCollabClick()
  }

  collaboratorClick = collaborator => {
    if (this.props.onCollabClick) this.props.onCollabClick(collaborator)
  }

  closeDialog = (name, name2) => {
    console.log('close dialog called', name)
    let newState = {}
    newState[`${name}Open`] = false
    if (name2){
      if (name2) newState[`${name2}Open`] = true
      e.preventDefault()
    } else {
      name2.preventDefault()
    }
    this.setState(newState)
  }

  openDialog = (name, name2, e) => {
    console.log('open dialog called', name, name2, e)
    let newState = {}
    newState[`${name}Open`] = true
    if (name2){
      newState[`${name2}Open`] = false
      e.preventDefault()
    } else {
      name2.preventDefault()
    }
    this.setState(newState)
  }

  deleteProject = () => {
    this.closeDialog('delete')
    if(this.props.onDelete) this.props.onDelete(this.props.project)
  }

  render () {
    const { collaborators, name, owner } = this.props.project
    let collaboratorsList = []
    // Collaborator Bubbles
    if (collaborators) {
      collaboratorsList = collaborators.map((user, i) => {
        return(
          <div key={`${name}-Collab-${i}`} className='ProjectTile-Collaborator' onClick={ this.collaboratorClick.bind(this, user) }>
            <Avatar
              className='ProjectTile-Collaborator-Avatar'
              src={ user.avatarUrl ? user.avatarUrl : null }
              icon={ user.avatarUrl ? null : <Avatar hoverColor={ hoverColor }> { user.username.charAt(0).toUpperCase() } </Avatar> }
              size={ avatarSize }
            />
          </div>
        )
      })
    }

    // New Collaborator Button
    if (this.props.onAddCollabClick) {
      collaboratorsList.push((
        <div key={`${name}-Add-Collab`} className='ProjectTile-Collaborator ProjectTile-Add' onClick={ this.addClick }>
          <Avatar
            className='ProjectTile-Collaborator-Avatar'
            icon={ <PersonAddIcon style={ personIconStyle } hoverColor={ hoverColor } /> }
            size={ avatarSize }
          />
        </div>
      ))
    }
    return (
      <div>
        <ProjectSettingsDialog
          project={ this.props.project }
          open={ this.state.settingsOpen }
          onSave={ this.saveSettings }
          onVimToggle={ this.toggleVim }
          vimEnabled={ this.state.vimEnabled }
        />
        <DeleteDialog
          name={ name }
          open={ this.state.deleteOpen || false }
          onSubmit={ this.deleteProject }
        />
        <Paper key={`Project-${name}`} className='ProjectTile'>
          <div className='ProjectTile-Top'>
            <span className='ProjectTile-Name' onClick={ this.handleSelect }>
              { name }
            </span>
            <Popover
              open={ this.state.dropdownOpen }
              anchorEl={ this.state.anchorEl }
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={ this.handleDropdownClose }
            >
              <List>
                <ListItem primaryText="More Settings" onClick={ this.openDialog.bind(this, 'settings', 'dropdown') }/>
                <ListItem primaryText="Delete" onClick={ this.openDialog.bind(this, 'delete', 'dropdown') }/>
              </List>
            </Popover>
            <SettingsIcon className='ProjectTile-Settings' onClick={ this.toggleDropdown } hoverColor={ hoverColor }/>
          </div>
          <span className='ProjectTile-Owner'>
            { (owner && owner.username) ? owner.username : 'No Owner' }
          </span>
          <div className='ProjectTile-Collaborators'>
            { collaboratorsList }
          </div>
        </Paper>
      </div>
    )
  }
}
