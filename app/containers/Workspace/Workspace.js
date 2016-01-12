import { merge, toArray, find, findIndex, isFunction, isUndefined } from 'lodash';
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Rebase from 're-base';
import { Actions } from 'redux-grout';
import * as TabActions from '../../actions/tabs';
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import SideBar from '../../components/SideBar/SideBar';
import Pane from '../../components/Pane/Pane';
import Grout from 'kyper-grout';
let grout = new Grout();

import './Workspace.scss';

let CombinedActions = merge(TabActions, Actions.files, Actions.account);
let activeFirepads = {};
class Workspace extends Component {
  constructor() {
    super();
    this.state = {inputVisible: false, settingsOpen: false, files: []};
  }
  static propTypes = {
    projectName: PropTypes.string,
    tabs: PropTypes.object,
    showButtons: PropTypes.bool
  };
  componentDidMount() {
    this.project = this.props.project ? grout.Project(this.props.project) : null;
    const userUrl = this.project.fbUrl.replace(`/${this.project.name}`, '');
    this.fb = Rebase.createClass(userUrl);
    //Listen to files list on firebase
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
      this.ref = this.fb.syncState(nextProps.projectName, {
        context: this,
        state: 'files',
        asArray: true
      });
    }
  }
  componentWillUnmount() {
    if(this.fb && isFunction(this.fb.removeBinding)){
      this.fb.removeBinding(this.ref);
    }
  }
  addFile = (addData) => {
    // console.log('add file called with:', addData);
    const { path } = addData;
    this.props.addFile({project: this.props.project, path});
  };
  addFolder = (addData) => {
    // console.log('add file called with:', addData);
    const { path } = addData;
    this.props.addFolder({project: this.props.project, path});
  };
  deleteFile = (data) => {
    // console.log('add file called with:', data);
    if(!data.path){
      this.props.deleteFile({project: this.props.project, data});
    }
  };
  openFile = (file) => {
    let tabData = {
      project: this.props.project,
      title: file.name || file.path.split('/')[file.path.split('/').length - 1],
      type: 'file',
      file,
    };
    const matchingInd = findIndex(this.props.tabs.list, {title: tabData.title});
    //TODO: Only open tab if file is not already open
    if(matchingInd === -1){
      //Select last tab
      this.props.openTab(tabData);
      let newInd =  this.props.tabs.list ? this.props.tabs.list.length - 1 : 0;
      // console.log('navigating to new tab:', tabData);
      // this.props.navigateToTab({project: this.props.project, index: newInd});
    } else {
      // console.warn('A tab with matching file data already exists', matchingInd);
      this.props.navigateToTab({
        project: this.props.project,
        index: matchingInd
      })
    }
  };
  toggleSettingsModal = (name) => {
    this.setState({
      settingsOpen: !this.state.settingsOpen
    });
  };
  saveSettings = (data) => {
    this.props.updateProject({project: this.props.project, data});
    //TODO: Show popup of save success/failure
    this.toggleSettingsModal.bind(this, 'settingsOpen');
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
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.toggleSettingsModal.bind(this, 'settingsOpen')}
      />,
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveSettings}
      />
    ];
    return (
      <div className="Workspace">
        <Dialog
          title="Settings"
          actions={actions}
          modal={false}
          open={this.state.settingsOpen}
          onRequestClose={this.toggleSettingsModal.bind(this, 'settingsOpen')}
          bodyClassName="Workspace-Settings"
          titleClassName="Workspace-Settings-Title"
          contentStyle={{'width': '30%'}}
          >
          <TextField hintText="Project Name" />
          <TextField hintText="Owner" />
          <TextField hintText="Project Url" />
          <TextField hintText="Git Url" />
        </Dialog>
        <SideBar
          projects={ this.props.projects }
          showProjects={ this.props.showProjects }
          projectName={ this.props.projectName }
          onProjectSelect={ this.props.onProjectSelect }
          showButtons={ this.props.showButtons }
          files={ this.state.files }
          hideName={ this.props.hideName }
          onFileClick={ this.openFile }
          onSettingsClick={ this.toggleSettingsModal.bind(this, 'settingsOpen')  }
          addFile={ this.addFile }
          addFile={ this.addFolder }
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
  return {
    project: { name, owner },
    projects: toArray(state.entities.projects),
    tabs,
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(CombinedActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Workspace);

function loadFirepadCodeshare(file, editor) {
  setTimeout(() => {
    if(typeof editor.firepad === 'undefined' && !activeFirepads[file.path]){
      // console.warn('firepad is not already existant. creating it');
      let editorSettings = grout.currentUser ? {userId: grout.currentUser.username} : {};
      //Load file content
      try {
        file.get().then(fileRes => {
          if(fileRes.content && !fileRes.history){
            editorSettings.defaultText = fileRes.content;
          }
          try {
            let firepad = createFirepad(file.fbRef, editor, editorSettings);
            firepad.on('ready', () => {
              activeFirepads[file.path] = firepad;
              // firepad.off('ready', () => {
              //  console.warn('Firepad off listener fired.', firepad);
              // });
            });
          } catch(err) {
            console.warn('Firepad called when already loaded');
          }
        }, err => {
          console.error('Error getting file data.', err);
        });
      } catch(err) {
        console.warn('Load firepad threw', err);
      }
    }
  }, 300)
}
