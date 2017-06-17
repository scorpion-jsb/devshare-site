import React, { PropTypes, Component } from 'react'
import { each, last, map } from 'lodash'
import classnames from 'classnames'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import AddIcon from 'material-ui/svg-icons/content/add-circle'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import GroupIcon from 'material-ui/svg-icons/social/group'
import CopyIcon from 'material-ui/svg-icons/content/content-copy'
import ArchiveIcon from 'material-ui/svg-icons/content/archive'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'
import { devshare } from 'redux-devshare'
import { bindActionCreators } from 'redux'
import { isLoaded } from 'react-redux-firebase'

import TreeView from '../../components/TreeView'
import ContextMenu from '../../components/ContextMenu'
import { actions as TabActions } from '../../modules/tabs'
import classes from './SideBar.scss'

const fileEntityBlackList = ['.DS_Store', 'node_modules']

const iconButtonStyle = { width: '50px', height: '50px', padding: '0px' }
const iconStyle = { width: '100%', height: '100%' }
const tooltipPosition = 'top-center'
const projectSelectLabelStyle = {
  fontSize: '1.5rem',
  fontWeight: '300',
  textOverflow: 'ellipsis'
}

@devshare()
@connect(
  null,
  (dispatch) => bindActionCreators(TabActions, dispatch)
)
export default class SideBar extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    projects: PropTypes.object,
    firebase: PropTypes.object,
    devshare: PropTypes.object,
    project: PropTypes.object.isRequired,
    files: PropTypes.object,
    tabs: PropTypes.object,
    openTab: PropTypes.func,
    closeTab: PropTypes.func,
    showProjects: PropTypes.bool,
    onSettingsClick: PropTypes.func.isRequired,
    onSharingClick: PropTypes.func.isRequired,
    navigateToTab: PropTypes.func,
    onShowPopover: PropTypes.func,
    onFileClick: PropTypes.func
  }

  state = {
    filesOver: false,
    contextMenu: {
      path: '',
      open: false,
      position: {
        x: 0,
        y: 0
      }
    }
  }

  componentDidMount () {
    this.refs.fileInput.setAttribute('webkitdirectory', '')
  }

  showContextMenu = (path, position) =>
    this.setState({
      contextMenu: {
        open: true,
        path,
        position
      }
    })

  dismissContextMenu = (path, position) =>
    this.setState({
      contextMenu: {
        open: false,
        path: '',
        position
      }
    })

  handleFileDrag = (e) => {
    e.preventDefault()
    this.setState({
      filesOver: true
    })
  }

  handleFileDrop = (e) => {
    e.preventDefault()
    this.setState({
      filesLoading: true,
      filesOver: false
    })
    each(e.dataTransfer.items, item => {
      let entry = item.webkitGetAsEntry()
      this.handleEntries(entry)
    })
    this.setState({
      filesLoading: false
    })
  }

  handleFileDragLeave = (e) => {
    this.setState({ filesOver: false })
  }

  handleEntries = (entries) => {
    if (entries.isFile) {
      this.readAndSaveFileEntry(entries)
    } else if (entries.isDirectory) {
      this.readAndSaveFolderEntry(entries)
    }
    each(entries, (entry) => {
      if (fileEntityBlackList.indexOf(last(entry.fullPath.split('/'))) === -1) {
        if (entry.isFile) {
          this.readAndSaveFileEntry(entry)
        } else if (entry.isDirectory) {
          this.readAndSaveFolderEntry(entry)
        }
      }
    })
  }

  readAndSaveFileEntry = (entry) => {
    let parent = this
    // TODO: Use bind instead of parent var
    function readAndSaveFile (file, path) {
      let reader = new FileReader()
      reader.onloadend = function (e) {
        parent.addFile(path, this.result)
      }
      reader.readAsText(file)
    }
    if (entry.webkitRelativePath) {
      readAndSaveFile(entry, entry.webkitRelativePath)
    } else {
      entry.file(file => readAndSaveFile(file, entry.fullPath))
    }
  }

  readAndSaveFolderEntry = (entry) => {
    this.addFolder(entry.fullPath)
    let reader = entry.createReader()
    reader.readEntries(folder => {
      if (folder.length > 1) { this.handleEntries(folder) }
    })
  }

  deleteFile = path =>
    this.props.devshare
      .project(this.props.project)
      .fileSystem
      .file(path)
      .remove()
      // .then(file => event({ category: 'Files', action: 'File deleted' }))

  downloadClick = () =>
    this.props.devshare
      .project(this.props.project)
      .download()
      .then(res => console.log('download successful:', res))
      .catch(error => {
        console.error('error downloading files', error)
        this.error = error.toString()
      })

  cloneClick = () => {
    // TODO: Open clone dialog
    console.log('Open clone dialog')
  }

  onFilesAdd = (e) => {
    e.preventDefault()
    each(e.target.files, item => {
      if (fileEntityBlackList.indexOf(last(item.webkitRelativePath.split('/'))) === -1) {
        this.readAndSaveFileEntry(item)
      }
    })
  }

  selectProject = (e, ind, projectName) => {
    this.context.router.push(`/${this.props.project.owner}/${projectName}`)
  }

  render () {
    const {
      files,
      project,
      projects,
      showProjects,
      onSettingsClick,
      onSharingClick,
      onShowPopover,
      tabs,
      onFileClick
    } = this.props

    const { contextMenu, filesOver } = this.state

    return (
      <div className={classnames(classes.container, { 'filehover': filesOver })}
        onDragOver={this.handleFileDrag}
        onDragLeave={this.handleFileDragLeave}
        onDrop={this.handleFileDrop}
        onContextMenu={this._rightClick}
      >
        <div className={classes.dropzone}>
          {
            showProjects
              ? (
                <SelectField
                  style={{width: '80%', marginLeft: '10%'}}
                  labelStyle={projectSelectLabelStyle}
                  autoWidth={false}
                  value={project.name}
                  onChange={this.selectProject}
                  >
                  {
                    map(projects, (project, i) =>
                      <MenuItem
                        key={`Project-${i}`}
                        label={project.name}
                        value={project.name}
                        primaryText={project.name}
                      />
                   )
                  }
                </SelectField>
              )
              : (
                <RaisedButton
                  label='Save To Account'
                />
              )
          }
          <TreeView
            files={files}
            tabs={tabs}
            onRightClick={this.showContextMenu}
            onFileClick={onFileClick}
            project={project}
            loading={!isLoaded(files)}
          />
          <input
            type='file'
            ref='fileInput'
            className={classes['file-input']}
            onChange={this.handleFileUpload}
            multiple
          />
          <div className={classes.buttons}>
            <IconButton
              style={iconButtonStyle}
              iconStyle={iconStyle}
              onClick={this.cloneClick}
              tooltip='Clone'
              tooltipPosition={tooltipPosition}
              touch
              disabled>
              <CopyIcon />
            </IconButton>
            <IconButton
              style={iconButtonStyle}
              iconStyle={iconStyle}
              onClick={this.downloadClick}
              tooltip='Download'
              tooltipPosition={tooltipPosition}
              touch
              disabled={!files || files.length < 1}>
              <ArchiveIcon />
            </IconButton>
          </div>
          <div className={classes.buttons}>
            <IconMenu
              iconButtonElement={
                <IconButton
                  style={iconButtonStyle}
                  iconStyle={iconStyle}
                  tooltip='Add'
                  tooltipPosition={tooltipPosition}
                  touch >
                  <AddIcon />
                </IconButton>
            }>
              <MenuItem
                primaryText='Upload files'
                onClick={this._fileUpload}
              />
              <MenuItem
                primaryText='Add file'
                onClick={() => onShowPopover('file')}
              />
              <MenuItem
                primaryText='Add folder'
                onClick={() => onShowPopover('folder')}
              />
            </IconMenu>
            <IconButton
              style={iconButtonStyle}
              iconStyle={iconStyle}
              onClick={onSharingClick}
              tooltip='Sharing'
              tooltipPosition={tooltipPosition}
              touch >
              <GroupIcon />
            </IconButton>
            <IconButton
              style={iconButtonStyle}
              iconStyle={iconStyle}
              onClick={onSettingsClick}
              tooltip='Settings'
              tooltipPosition={tooltipPosition}
              touch >
              <SettingsIcon />
            </IconButton>
          </div>
          {
            contextMenu.open
            ? (
              <ContextMenu
                path={contextMenu.path}
                onAddFileClick={() => onShowPopover('file')}
                onAddFolderClick={() => onShowPopover('folder')}
                onFileDelete={this.deleteFile}
                position={contextMenu.position}
                dismiss={this.dismissContextMenu}
              />
            ) : null
          }
        </div>
      </div>
    )
  }

  _rightClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.showContextMenu(null, { x: e.clientX, y: e.clientY })
  }

  _fileUpload = (e) => {
    this.refs.fileInput.click()
  }

}
