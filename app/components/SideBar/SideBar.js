import { isArray, isUndefined, find, isString } from 'lodash';
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
    this.selectProject = this.selectProject.bind(this);
  }
  static propTypes = {
    projects: PropTypes.array,
    project: PropTypes.object,
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
      let proj = find(this.props.projects, { name });
      this.props.onProjectSelect(proj, i);
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
            value={ this.props.project.name }
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
          projectName={ this.props.project.name }
          onFilesDrop={ this.props.onFilesDrop }
          onFileDelete={ this.props.onFileDelete }
        />
        { this.props.showButtons ?
          <div className="SideBar-Buttons">
            <button className="SideBar-Button" onClick={ this.props.onSettingsClick }>
              <span className="SideBar-Button-Label">Settings</span>
            </button>
          </div> : null
        }
      </div>
    );
  }
}
