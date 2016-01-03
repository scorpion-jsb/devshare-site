import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import TreeView from '../TreeView';

import './SideBar.scss';

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.buildButtons = this.buildButtons.bind(this);
  }
  static propTypes = {
    files: PropTypes.array,
    projectName: PropTypes.string,
    onFileClick: PropTypes.func,
    onPublishClick: PropTypes.func,
    onNewFileClick: PropTypes.func,
    showButtons: PropTypes.bool,
    onLogoutClick: PropTypes.func,
    addFile: PropTypes.func,
    loadFiles: PropTypes.func,
    onFilesDrop: PropTypes.func
  };
  buildButtons() {
    if(this.props && this.props.showButtons){
      return (
        <div className="SideBar-Buttons">
          <button className="SideBar-Button" onClick={ this.props.onSettingsClick }>
            <span className="SideBar-Button-Label">Settings</span>
          </button>
        </div>
      );
    }
    return;
  }
  render() {
    let files = (this.props && this.props.files) ? this.props.files : [];
    let buttons = this.buildButtons();
    let projectName = (this.props && this.props.projectName && !this.props.hideName) ? this.props.projectName : '';
    return (
      <div className="SideBar">
        <h3 className="SideBar-Name">{ projectName }</h3>
        <TreeView
          account={ this.props.account }
          fileStructure={ files }
          onFileClick={ this.props.onFileClick }
          onNewFileClick={ this.props.onNewFileClick }
          addFile={ this.props.addFile }
          projectName={ this.props.projectName }
          onFilesDrop={ this.props.onFilesDrop }
        />
        { buttons }
      </div>
    );
  }
}
