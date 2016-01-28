import {
  merge, toArray, find,
  findIndex, isFunction,
  isUndefined, isString
} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
    project: PropTypes.object.isRequired,
    tabs: PropTypes.object,
    showButtons: PropTypes.bool
  };

  componentDidMount() {
    this.project = this.props.project ? grout.Project(this.props.project.name, this.props.project.owner.username) : null;
    this.fb = Rebase.createClass(this.project.fbUrl.replace(this.props.project.name, ''));
    //Bind to files list on firebase
    this.ref = this.fb.bindToState(this.props.project.name, {
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
    });
  };

  toggleSharingModal = () => {
    this.setState({
      sharingOpen: !this.state.sharingOpen
    });
  };

  saveSettings = (data) => {
    this.props.updateProject({project: this.props.project, data});
    //TODO: Show popup of save success/failure
    this.toggleSettingsModal();
  };

  addFile = (path) => {
    this.props.addFile(this.props.project, path);
  };

  addFolder = (path) => {
    this.props.addFolder(this.props.project, path);
  };

  deleteFile = (path) => {
    this.props.deleteFile(this.props.project, path);
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

  selectTab = (index) => {
    this.props.navigateToTab({project: this.props.project, index});
  };

  closeTab = (index) => {
    let file = this.props.tabs.list[index].file;
    this.props.closeTab({project: this.props.project, index});
  };

  onFilesDrop = (files) => {
    this.props.addFiles(this.props.project, files);
  };

  searchUsers = (q, cb) => {
    grout.Users.search(q).then(usersList=> {
      cb(null, usersList);
    }, err => {
      cb(err);
    });
  };

  addCollaborator = (collaborator) => {
    let project = this.props.project;
    this.props.addCollaborator(collaborator, project);
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
          onAccountSearch={ this.searchUsers }
          onAddCollab={ this.addCollaborator }
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
          project={ this.props.project }
        />
      </div>
    );
  }
}

//Place state of redux store into props of component
function mapStateToProps(state) {
  const { username, projectName } = state.router.params;
  const owner = username || 'anon';
  const name = projectName || null;
  const key = owner ? `${owner}/${name}` : name;
  const tabs = (state.tabs && state.tabs[key]) ? state.tabs[key] : {};
  const projects =  (state.entities && state.entities.projects) ? toArray(state.entities.projects) : [];
  return {
    projects,
    tabs,
    account: state.account,
    router: state.router
  };
}

let CombinedActions = merge(TabActions, Actions.files, Actions.account, Actions.projects);

//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(CombinedActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
