import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import TreeView from '../TreeView';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import './SideBar.scss';

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.buildButtons = this.buildButtons.bind(this);
    this.selectProject = this.selectProject.bind(this);
  }
  static propTypes = {
    projects: PropTypes.array,
    projectName: PropTypes.string,
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onPublishClick: PropTypes.func,
    onNewFileClick: PropTypes.func,
    showButtons: PropTypes.bool,
    onLogoutClick: PropTypes.func,
    addFile: PropTypes.func,
    loadFiles: PropTypes.func,
    onFilesDrop: PropTypes.func
  };
  selectProject(e, i, name) {
    console.log('handle change:', i, name);
    if(this.props && this.props.onProjectSelect){
      this.props.onProjectSelect(name, i);
    }
  }
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
  }
  render() {
    let files = (this.props && this.props.files) ? this.props.files : [];
    let buttons = this.buildButtons();
    let projectsMenu;
    if(this.props.projects){
      projectsMenu = this.props.projects.map((project, i) => {
        return <MenuItem key={`Project-${i}`} label={ project.name } value={ project.name } primaryText={ project.name }/>
      });
    }
    return (
      <div className="SideBar">
        <SelectField
          style={{width: '80%', marginLeft: '10%'}}
          labelStyle={{fontSize: '1.5rem', fontWeight: '300'}}
          autoWidth={ true }
          value={ this.props.projectName }
          children={ projectsMenu }
          onChange={ this.selectProject }
        />
        <TreeView
          account={ this.props.account }
          fileStructure={ files }
          onFileClick={ this.props.onFileClick }
          onNewFileClick={ this.props.onNewFileClick }
          addFile={ this.props.addFile }
          projectName={ this.props.projectName }
          onFilesDrop={ this.props.onFilesDrop }
          onFileDelete={ this.props.onFileDelete }
        />
        { buttons }
      </div>
    );
  }
}
