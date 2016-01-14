import { merge, toArray, find, findIndex, isFunction, isUndefined, isString } from 'lodash';
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Rebase from 're-base';
import { Actions } from 'redux-grout';
import * as TabActions from '../../actions/tabs';
import RaisedButton from 'material-ui/lib/raised-button';
import SideBar from '../../components/SideBar/SideBar';
import ProjectSettingsDialog from '../../components/ProjectSettingsDialog/ProjectSettingsDialog';
import SharingDialog from '../../components/SharingDialog/SharingDialog';
import Pane from '../../components/Pane/Pane';
import WorkspacePopover from '../../components/WorkspacePopover/WorkspacePopover';
import Grout from 'kyper-grout';
import './Workspace.scss';

let activeFirepads = {};
let grout = new Grout();

class Workspace extends Component {

  constructor() {
    super();
  }

  state = {
    inputVisible: false,
    settingsOpen: false,
    sharingOpen: false,
    files: [],
    addPath: '',
    addType: 'file',
    popoverOpen: false
  };

  static propTypes = {
    project: PropTypes.object,
    tabs: PropTypes.object,
    showButtons: PropTypes.bool
  };

  componentDidMount() {
    this.project = this.props.project ? grout.Project(this.props.project) : null;
    const userUrl = this.project.fbUrl.replace(`/${this.project.name}`, '');
    this.fb = Rebase.createClass(userUrl);
    //Bind to files list on firebase
    this.ref = this.fb.syncState(this.props.project.name, {
      context: this,
      state: 'files',
      asArray: true
    });
  }

  componentWillReceiveProps(nextProps) {
    //Rebind files if props change (new project selected)
    if(this.fb){
      if(isFunction(this.fb.removeBinding)){
        this.fb.removeBinding(this.ref);
      }
      this.ref = this.fb.syncState(nextProps.project.name, {
        context: this,
        state: 'files',
        asArray: true
      });
    }
  }

  componentWillUnmount() {
    //Unbind files list from Firebase
    if(this.fb && isFunction(this.fb.removeBinding)){
      this.fb.removeBinding(this.ref);
    }
  }

  toggleSettingsModal = () => {
    this.setState({
      settingsOpen: !this.state.settingsOpen
    })
  };

  toggleSharingModal = () => {
    this.setState({
      sharingOpen: !this.state.sharingOpen
    })
  };

  saveSettings = (data) => {
    this.props.updateProject({project: this.props.project, data});
    //TODO: Show popup of save success/failure
    this.toggleSettingsModal();
  };

  addFile = (file) => {
    this.props.addFile({project: this.props.project, path: file});
  };

  addFolder = (folder) => {
    this.props.addFolder({project: this.props.project, path: folder});
  };

  deleteFile = (file) => {
    this.props.deleteFile({project: this.props.project, file});
  };

  openFile = (file) => {
    let tabData = {
      project: this.props.project,
      title: file.name || file.path.split('/')[file.path.split('/').length - 1],
      type: 'file',
      file,
    };
    //Search for already matching title
    //TODO: Search by matching path instead of tab title
    const matchingInd = findIndex(this.props.tabs.list, {title: tabData.title});
    //Only open tab if file is not already open
    if(matchingInd === -1){
      this.props.openTab(tabData);
      //Select last tab
      let newInd =  this.props.tabs.list ? this.props.tabs.list.length - 1 : 0;
      this.props.navigateToTab({project: this.props.project, index: newInd});
    } else {
      this.props.navigateToTab({
        project: this.props.project,
        index: matchingInd
      })
    }
  };

  loadCodeSharing = (editor) => {
    let { list, currentIndex } = this.props.tabs;
    if(list && list[currentIndex || 0].file){
      const { file } = list[currentIndex || 0];
      let fileObj = grout.Project(this.props.project).File(file);
      // console.log('calling load code sharing', editor, fileData);
      loadFirepadCodeshare(fileObj, editor);
    }
  };

  selectTab = (index) => {
    this.props.navigateToTab({project: this.props.project, index});
  };

  closeTab = (index) => {
    // console.log('closing tab:', this.props.tabs.list[index]);
    let file = this.props.tabs.list[index].file;
    if(activeFirepads[file.path]){
      activeFirepads[file.path].dispose();
      delete activeFirepads[file.path];
    }
    this.props.closeTab({project: this.props.project, index});
  };

  onFilesDrop = (files) => {
    console.log('files dropped:', files);
    this.props.addFiles({project: this.props.project, files});
  };

  showPopover = (type, path) => {
    this.setState({
      addPath: path,
      addType: type,
      popoverOpen: true
    });
  };

  addEntity = (type, path) => {
    if (type === 'folder') {
      this.addFolder(path);
    }
    if (type === 'file') {
      this.addFile(path);
    }
  };

  handlePopoverClose = () => {
    this.setState({
      popoverOpen: false
    });
  };

  render() {
    return (
      <div className="Workspace" ref="workspace">
        <WorkspacePopover
          workspaceElement={ this.refs.workspace }
          initialPath={ this.state.addPath }
          type={ this.state.addType }
          onSubmit={ this.addEntity }
          open={ this.state.popoverOpen }
          onClose={ this.handlePopoverClose }
        />
        <ProjectSettingsDialog
          project={ this.props.project }
          modalOpen={ this.state.settingsOpen }
          toggleModal={ this.toggleSettingsModal }
        />
        <SharingDialog
          project={ this.props.project }
          modalOpen={ this.state.sharingOpen }
          toggleModal={ this.toggleSharingModal }
        />
        <SideBar
          projects={ this.props.projects }
          showProjects={ this.props.showProjects }
          project={ this.props.project }
          onProjectSelect={ this.props.onProjectSelect }
          showButtons={ this.props.showButtons }
          files={ this.state.files }
          hideName={ this.props.hideName }
          onFileClick={ this.openFile }
          onSettingsClick={ this.toggleSettingsModal  }
          onSharingClick={ this.toggleSharingModal  }
          onAddFileClick={ this.showPopover.bind(this, 'file') }
          onAddFolderClick={ this.showPopover.bind(this, 'folder') }
          onFilesDrop={ this.onFilesDrop }
          onFileDelete={ this.deleteFile }
        />
        <Pane
          tabs={ this.props.tabs }
          onTabSelect={ this.selectTab }
          onTabClose={ this.closeTab }
          onActiveLoad={ this.loadCodeSharing }
        />
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  let owner = state.router.params ? state.router.params.owner : null;
  let name = state.router.params ? state.router.params.projectName : null;
  let key = owner ? `${owner}/${name}` : name;
  let tabs = (state.tabs[key] && state.tabs[key]) ? state.tabs[key] : {};//Tab data
  //Populate owner param
  let projects = toArray(state.entities.projects).map((project) => {
    if(project.owner && isString(project.owner) && state.entities.accounts[project.owner]){
      project.owner = state.entities.accounts[project.owner];
    }
    return project;
  });
  //Populate owner param
  //TODO: Change namespacing to key instead of name
  const collaboratorsList = (state.entities.projects  && state.entities.projects[name] && state.entities.projects[name].collaborators) ? state.entities.projects[name].collaborators : [];
  let collaborators = [];
  if(collaboratorsList.length > 0){
    collaborators = collaboratorsList.map((collabId) => {
      if(state.entities.accounts && state.entities.accounts[collabId]){
        return state.entities.accounts[collabId];
      }
      return collabId;
    });
  }
  return {
    project: { name, owner, collaborators },
    projects,
    tabs,
    account: state.account,
    router: state.router
  };
}
let CombinedActions = merge(TabActions, Actions.files, Actions.account);
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(CombinedActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Workspace);

function loadFirepadCodeshare(file, editor) {
  if(typeof editor.firepad === 'undefined' && !activeFirepads[file.path]){
    // console.warn('firepad is not already existant. creating it');
    let editorSettings = grout.currentUser ? {userId: grout.currentUser.username} : {};
    //Load file content
    try {
      let firepad = createFirepad(file.fbRef, editor, editorSettings);
      firepad.on('ready', () => {
        activeFirepads[file.path] = firepad;
        if(firepad.isHistoryEmpty()){
          file.get().then(fileRes => {
            if(fileRes.content){
              firepad.setText(fileRes.content);
            }
          });
        }
      });
    } catch(err) {
      console.warn('Load firepad error:', err);
    }
  }
}
