import { toArray, findIndex } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'redux-grout';
import Workspace from '../Workspace/Workspace';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import './Project.scss';

class Project extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {projectName: this.props.projectName, currentInd: findIndex(this.props.projects, {name: this.props.projectName})};
  }
  componentDidMount() {
    if(!this.props.projects){
      this.props.getProjects();
    }
  }
  handleChange(e, i, name) {
    console.log('handle change:', i, name);
    this.setState({
      projectName: name
    })
    this.props.history.pushState(null, `/projects/${name}`);
  }
  render(){
    let projectsMenu;
    if(this.props.projects){
      projectsMenu = this.props.projects.map((project, i) => {
        return <MenuItem key={`Project-${i}`} label={ project.name } value={ project.name } primaryText={ project.name }/>
      });
    }
    return (
      <div className="Project">
        <Toolbar className="Project-Toolbar">
          <ToolbarGroup className="Project-Select" firstChild={true} float="left">
            <SelectField
              style={{width: '200px'}}
              labelStyle={{fontSize: '1.5rem', fontWeight: '300', color: 'white'}}
              autoWidth={ true }
              value={this.state.projectName}
              children={ projectsMenu }
              onChange={ this.handleChange }
            />
          </ToolbarGroup>
        </Toolbar>
        <Workspace
          projectName={ this.state.projectName }
          showButtons={ true }
        />
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    projectName: state.router.params.projectName,
    projects: state.entities.projects ? toArray(state.entities.projects) : null,
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
