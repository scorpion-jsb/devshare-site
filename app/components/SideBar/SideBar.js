import { isArray, isUndefined } from 'lodash';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import TreeView from '../TreeView';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import AddIcon from 'material-ui/lib/svg-icons/content/add-circle';
import SettingsIcon from 'material-ui/lib/svg-icons/action/settings';
import './SideBar.scss';

export default class SideBar extends Component {
  constructor(props) {
    super(props);
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
    if(this.props && this.props.onProjectSelect){
      this.props.onProjectSelect(name, i);
    }
  }
  render() {
    const showProjects = !isUndefined(this.props.showProjects) ? this.props.showProjects : true;
    let projectsMenu;
    if(isArray(this.props.projects) && this.props.projects.length > 0) {
      projectsMenu = this.props.projects.map((project, i) => {
        return <MenuItem key={`Project-${i}`} label={ project.name } value={ project.name } primaryText={ project.name }/>
      });
    }
    return (
      <div className="SideBar">
        { (projectsMenu && showProjects) ?
          <SelectField
            style={{width: '80%', marginLeft: '10%'}}
            labelStyle={{fontSize: '1.5rem', fontWeight: '300'}}
            autoWidth={ true }
            value={ this.props.projectName }
            children={ projectsMenu }
            onChange={ this.selectProject }
          /> : null
        }
        <TreeView
          account={ this.props.account }
          fileStructure={ this.props.files }
          onFileClick={ this.props.onFileClick }
          onNewFileClick={ this.props.onNewFileClick }
          addFile={ this.props.addFile }
          projectName={ this.props.projectName }
          onFilesDrop={ this.props.onFilesDrop }
          onFileDelete={ this.props.onFileDelete }
        />

        <div className="SideBar-Buttons">
          <IconMenu className="SideBar-Button" iconButtonElement={ <IconButton style={{ width: '100px', height: '100px' }} iconStyle={{ width: '100%', height: '100%' }} ><AddIcon /></IconButton> }>
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Send feedback" />
            <MenuItem primaryText="Settings" />
            <MenuItem primaryText="Help" />
            <MenuItem primaryText="Sign out" />
          </IconMenu>
          <IconButton style={{ width: '100px', height: '100px' }} iconStyle={{ width: '100%', height: '100%' }} className="SideBar-Button" onClick={ this.props.onSettingsClick }>
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}
