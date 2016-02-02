import {
  merge, toArray, find,
  findIndex, isFunction,
  isUndefined, isString,
  each, isEqual, debounce,
  last
} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import Rebase from 're-base';
import { Actions } from 'redux-grout';
import Grout from 'kyper-grout';
import * as TabActions from '../../actions/tabs';
import SideBar from '../../components/SideBar/SideBar';
import ProjectSettingsDialog from '../../components/ProjectSettingsDialog/ProjectSettingsDialog';
import SharingDialog from '../../components/SharingDialog/SharingDialog';
import Pane from '../../components/Pane/Pane';
import WorkspacePopover from '../../components/WorkspacePopover/WorkspacePopover';
import RaisedButton from 'material-ui/lib/raised-button';

import './Workspace.scss';

let grout = new Grout();
let fileEntityBlackList = ['.DS_Store', 'node_modules'];

class Workspace extends Component {
  constructor() {
    super();
    this.debounceStateChange = debounce(this.debounceStateChange, 1000);
  }

  state = {
    inputVisible: false,
    settingsOpen: false,
    sharingOpen: false,
    files: [],
    addPath: '',
    addType: 'file',
    popoverOpen: false,
    debouncedFiles: [],
  };

  static propTypes = {
    project: PropTypes.object.isRequired,
    tabs: PropTypes.object,
    showButtons: PropTypes.bool
  };

  componentDidMount() {
    const { name, owner } = this.props.project;
    this.project = this.props.project ? grout.Project(name, owner.username) : null;
    this.fb = Rebase.createClass(this.project.fbUrl.replace(name, ''));
    //Bind to files list on firebase
    this.ref = this.fb.bindToState(name, {
      context: this,
      state: 'files',
      asArray: true
    });
    this.debounceStateChange();
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

  componentWillUpdate(nextProps, nextState) {
    if (!isEqual(this.state.files, nextState.files)) {
      this.debounceStateChange();
    }
  }

  debounceStateChange = () => {
    this.setState({
      debouncedFiles: this.state.files
    });
  };

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
    // console.log('save settings called:', data);
    this.props.updateProject(this.props.project, data);
    //TODO: Show popup of save success/failure
    this.toggleSettingsModal();
  };

  addFile = (path, content) => {
    this.props.addFile(this.props.project, path, content);
  };

  addFolder = (path) => {
    this.props.addFolder(this.props.project, path);
  };

  deleteFile = (path) => {
    this.props.deleteFile(this.props.project, path);
  };

  openFile = (file) => {
    const { project, tabs } = this.props;
    const tabData = {
      project,
      title: file.name || file.path.split('/')[file.path.split('/').length - 1],
      type: 'file',
      file,
    };
    //TODO: Search by matching path instead of tab title
    //Search for already matching title
    const matchingInd = findIndex(tabs.list, {title: tabData.title});
    //Only open tab if file is not already open
    if(matchingInd === -1){
      this.props.openTab(tabData);
      //Select last tab
      const newInd =  tabs.list ? tabs.list.length - 1 : 0;
      return this.props.navigateToTab({project, index: newInd});
    }
    this.props.navigateToTab({
      project,
      index: matchingInd
    });
  };

  selectTab = (index) => {
    this.props.navigateToTab({project: this.props.project, index});
  };

  closeTab = (index) => {
    this.props.closeTab({ project: this.props.project, index });
  };

  readAndSaveFileEntry = (entry) => {
    entry.file(file => {
      let reader = new FileReader();
      let parent = this;
      reader.onloadend = function(e) {
        parent.addFile(entry.fullPath, this.result);
      }
      reader.readAsText(file);
    })
  };

  readAndSaveFolderEntry = (entry) => {
    this.addFolder(entry.fullPath);
    let reader = entry.createReader();
    reader.readEntries(folder => {
      if (folder.length > 1) {
        this.handleEntries(folder);
      }
    });
  };

  handleEntries = (entries) => {
    if (entries.isFile) {
      this.readAndSaveFileEntry(entries);
    } else if (entries.isDirectory) {
      this.readAndSaveFolderEntry(entries);
    }

    each(entries, entry => {
      if (fileEntityBlackList.indexOf(last(entry.fullPath.split('/'))) !== -1) {
        return void 0;
      }
      if (entry.isFile) {
        this.readAndSaveFileEntry(entry);
      } else if (entry.isDirectory) {
        this.readAndSaveFolderEntry(entry);
      }
    })
  };

  onFilesDrop = (e) => {
    e.preventDefault();
    let items = e.dataTransfer.items;
    each(items, item => {
      var entry = item.webkitGetAsEntry();
      this.handleEntries(entry);
    });
  };

  searchUsers = (q, cb) => {
    grout.Users.search(q).then(usersList => {
      cb(null, usersList);
    }, err => {
      cb(err);
    });
  };

  showPopover = (addType, addPath) => {
    this.setState({
      addPath,
      addType,
      popoverOpen: true
    });
  };

  addEntity = (type, path, content) => {
    if (type === 'folder') return this.addFolder(path);
    this.addFile(path, content);
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
        <SideBar
          projects={ this.props.projects }
          showProjects={ this.props.showProjects }
          project={ this.props.project }
          onProjectSelect={ this.props.onProjectSelect }
          showButtons={ this.props.showButtons }
          files={ this.state.debouncedFiles }
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
        {
          this.state.settingsOpen ?
          <ProjectSettingsDialog
            project={ this.props.project }
            modalOpen={ this.state.settingsOpen }
            toggleModal={ this.toggleSettingsModal }
            onSave={ this.saveSettings }
          /> : null
        }
        {
          this.state.sharingOpen ?
          <SharingDialog
            project={ this.props.project }
            modalOpen={ this.state.sharingOpen }
            toggleModal={ this.toggleSharingModal }
            onAccountSearch={ this.searchUsers }
            onSave={ this.saveSettings }
          /> : null
        }
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
