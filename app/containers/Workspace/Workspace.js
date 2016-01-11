import { merge, toArray, find, findIndex } from 'lodash';
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
let base = Rebase.createClass('https://kyper-tech.firebaseio.com/tessellate/files');

import './Workspace.scss';

let CombinedActions = merge(TabActions, Actions.files, Actions.account);

class Workspace extends Component {
  constructor() {
    super();
    this.state = {inputVisible: false, settingsOpen: false, files: []};
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
    this.openFile = this.openFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.closeTab = this.closeTab.bind(this);
    this.loadCodeSharing = this.loadCodeSharing.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.onFilesDrop = this.onFilesDrop.bind(this);
    this.activeFirepads = {};
  }
  static propTypes = {
    projectName: PropTypes.string,
    tabs: PropTypes.object,
    showButtons: PropTypes.bool
  };
  componentDidMount() {
    //Listen to files list on firebase
    this.ref = base.syncState(this.props.projectName, {
      context: this,
      state: 'files',
      asArray: true
    });
  }
  componentWillReceiveProps(nextProps) {
    //Rebind files if props change (new project selected)
    base.removeBinding(this.ref);
    this.ref = base.syncState(nextProps.projectName, {
      context: this,
      state: 'files',
      asArray: true
    });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  addFile(addData) {
    console.log('add file called with:', addData);
    this.props.addFile(addData);
  }
  deleteFile(data) {
    console.log('add file called with:', data);
    this.props.deleteFile({project: {name: this.props.projectName}, data});
  }
  openFile(file){
    let tabData = {
      projectName: this.props.projectName,
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
      console.log('navigating to new tab:', tabData);
      this.props.navigateToTab({projectName: this.props.projectName, index: newInd});
    } else {
      console.warn('A tab with matching file data already exists', matchingInd);
      this.props.navigateToTab({
        projectName: this.props.projectName,
        index: matchingInd
      })
    }

  }
  toggleSettingsModal(name) {
    this.setState({
      settingsOpen: !this.state.settingsOpen
    });
  }
  saveSettings(updatedSettings) {
    this.props.updateProject(updatedSettings);
    //TODO: Show popup of save success/failure
    this.toggleSettingsModal.bind(this, 'settingsOpen');
  }
  loadCodeSharing(editor){
    let tabs = this.props.tabs;
    if(tabs.list && tabs.list[tabs.currentIndex || 0].file){
      let fileData = tabs.list[tabs.currentIndex].file;
      console.log('calling load code sharing', editor, fileData);
      if(typeof editor.firepad === 'undefined' && !this.activeFirepads[fileData.path]){
        let file = grout.Project(this.props.projectName).File(fileData);
        console.warn('file object created:', file);
        let firepad = createFirepad(file.fbRef, editor, {userId: grout.currentUser.username});
        firepad.on('ready', () => {
          console.warn('Firepad is ready:', firepad);
          this.activeFirepads[file.path] = firepad;
          firepad.off('ready', () => {
            console.warn('Firepad off listener fired.', firepad);
          });
        });
      }
    }
  }
  selectTab(index){
    this.props.navigateToTab({projectName: this.props.projectName, index});
  }
  closeTab(index){
    console.log('closing tab:', this.props.tabs.list[index]);
    let file = this.props.tabs.list[index].file;
    if(this.activeFirepads[file.path]){
      this.activeFirepads[file.path].dispose();
      delete this.activeFirepads[file.path];
    }
    this.props.closeTab({projectName: this.props.projectName, index});
  }
  onFilesDrop(files) {
    console.log('files dropped:', files);
    this.props.addFiles({projectName: this.props.projectName, files});
  }
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
          onFilesDrop={ this.onFilesDrop }
          onFileDelete={ this.props.deleteFile }
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
  let projectName = state.router.params ? state.router.params.projectName : null;
  let tabs = (state.tabs[projectName] && state.tabs[projectName]) ? state.tabs[projectName] : {};//Tab data
  return {
    projectName: projectName,
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
