import { merge } from 'lodash';
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import { Actions } from 'redux-grout';
import Rebase from 're-base';
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import * as TabActions from '../../actions/tabs';
import SideBar from '../../components/SideBar/SideBar';
import Pane from '../../components/Pane/Pane';
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
    this.selectTab = this.selectTab.bind(this);
    this.closeTab = this.closeTab.bind(this);
    this.loadCodeSharing = this.loadCodeSharing.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.onFilesDrop = this.onFilesDrop.bind(this);
  }
  static propTypes = {
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
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  addFile(addData) {
    console.log('add file called with:', addData);
    this.props.addFile(addData);
  }
  openFile(fileData){
    this.props.openFileInTab({projectName: this.props.projectName, file: fileData});
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
    let file = this.props.tabs.list[this.props.tabs.currentIndex || 0].file;
    // console.log('calling load code sharing', editor);
    // if(!editor.firepad && !beenCalled[file.name || file.path]){
    //   beenCalled[file.name || file.path] = true;
    //   this.props.syncEditor({projectName: this.projectName, editor: editor, file: file});
    // }
  }
  selectTab(index){
    this.props.navigateToTab({projectName: this.props.projectName, index});
  }
  closeTab(index){
    this.props.closeTab({projectName: this.props.projectName, index});
    //TODO: Dispose Firepad
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
          showButtons={ this.props.showButtons }
          files={ this.state.files }
          hideName={ this.props.hideName }
          projectName={ this.props.projectName }
          onFileClick={ this.openFile }
          onSettingsClick={ this.toggleSettingsModal.bind(this, 'settingsOpen')  }
          addFile={ this.addFile }
          onFilesDrop={ this.onFilesDrop }
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
    tabs: tabs,
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(CombinedActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
