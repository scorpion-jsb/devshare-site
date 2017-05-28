import React, { Component, PropTypes } from 'react'
import { devshare } from 'redux-devshare'
import { findIndex } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as TabActions } from '../../modules/tabs'
import SideBar from '../SideBar'
import Pane from '../Pane'
import WorkspacePopover from '../../components/WorkspacePopover'
import classes from './Workspace.scss'

@devshare()
@connect(
  null,
  (dispatch) => bindActionCreators(TabActions, dispatch)
)
export default class Workspace extends Component {
  static propTypes = {
    devshare: PropTypes.shape({
      project: PropTypes.func,
      users: PropTypes.func
    }),
    params: PropTypes.shape({
      username: PropTypes.string,
      projectname: PropTypes.string
    }),
    account: PropTypes.object,
    project: PropTypes.object,
    projects: PropTypes.object,
    tabs: PropTypes.object,
    files: PropTypes.object,
    showProjects: PropTypes.bool,
    hideName: PropTypes.bool,
    showButtons: PropTypes.bool,
    navigateToTab: PropTypes.func,
    closeTab: PropTypes.func,
    addCollaborator: PropTypes.func,
    removeCollaborator: PropTypes.func,
    onSettingsClick: PropTypes.func.isRequired,
    onSharingClick: PropTypes.func.isRequired,
    onProjectSelect: PropTypes.func,
    openTab: PropTypes.func
  }

  state = {
    inputVisible: false,
    settingsOpen: false,
    sharingOpen: false,
    addPath: '',
    addType: 'file',
    popoverOpen: false,
    debouncedFiles: null,
    filesLoading: false
  }

  toggleSettingsModal = () =>
    this.setState({
      settingsOpen: !this.state.settingsOpen
    })

  toggleSharingModal = () =>
    this.setState({
      sharingOpen: !this.state.sharingOpen
    })

  showPopover = (addType, addPath) =>
    this.setState({
      addPath,
      addType,
      popoverOpen: true
    })

  handlePopoverClose = () =>
    this.setState({
      popoverOpen: false
    })

  saveSettings = data =>
    this.toggleSettingsModal()

  addCollaborator = username =>
    this.props.addCollaborator(this.props.project, username)

  removeCollaborator = username =>
    this.props.removeCollaborator(this.props.project, username)

  // TODO: expose search in redux-firebase
  searchUsers = (q, cb) => {
    this.props.devshare
      .users()
      .search(q)
      .then(usersList =>
        cb(null, usersList),
        error => cb(error)
      )
  }

  addFile = (path, content) =>
    this.props.devshare
      .project(this.props.params.username, this.props.params.projectname)
      .fileSystem
      .addFile(path, content)
      // .then(file => event({ category: 'Files', action: 'File added' }))
      .catch(error => {
        console.error('error adding file', error)
        this.error = error.toString
      })

  addFolder = path =>
    this.props.devshare
      .project(this.props.project)
      .fileSystem
      .addFolder(path.replace('/', ''))
      // .then(file => event({ category: 'Files', action: 'Folder added' }))

  addEntity = (type, path, content) =>
    type === 'folder'
      ? this.addFolder(path)
      : this.addFile(path, content)

  deleteFile = (path) =>
    this.props.devshare
      .project(this.props.project)
      .fileSystem
      .file(path)
      .remove()
      // .then(file => event({ category: 'Files', action: 'File deleted' }))

  openFile = file => {
    console.debug('open file called', file)
    const { tabs, params: { username, projectname } } = this.props
    const tabData = {
      title: file.name || file.path.split('/')[file.path.split('/').length - 1],
      type: 'file',
      file
    }

    // check if tab is already open
    let tabIndex = findIndex(tabs.list, (t) => t.file.path === tabData.file.path)

    // Only open tab if file is not already open
    if (tabIndex < 0) {
      this.props.openTab({ name: projectname, owner: username }, tabData)
      tabIndex = tabs.list.length
    }

    // activate selected tab
    this.props.navigateToTab({ name: projectname, owner: username }, tabIndex)
  }

  render () {
    const {
      project,
      params,
      onSettingsClick,
      onSharingClick,
      account,
      files,
      projects,
      tabs
    } = this.props

    return (
      <div className={classes.container} ref='workspace'>
        <WorkspacePopover
          workspaceElement={this.refs.workspace}
          initialPath={this.state.addPath}
          type={this.state.addType}
          onSubmit={this.addEntity}
          open={this.state.popoverOpen}
          onClose={this.handlePopoverClose}
        />
        <SideBar
          project={project}
          projects={projects}
          account={account}
          files={files}
          tabs={tabs}
          onFileClick={this.openFile}
          onSettingsClick={onSettingsClick}
          onSharingClick={onSharingClick}
          showProjects={!!account && !!account.username}
          onShowPopover={this.showPopover}
        />
        <Pane
          project={{ name: params.projectname, owner: params.username }}
          tabs={tabs}
        />
      </div>
    )
  }
}
