import { toArray } from 'lodash';
import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import ProjectTile from '../../components/ProjectTile/ProjectTile';
import NewProjectTile from '../../components/NewProjectTile/NewProjectTile';
import NewProjectDialog from '../../components/NewProjectDialog/NewProjectDialog';
import TextField from 'material-ui/lib/text-field';
import { Actions } from 'redux-grout';
import './Projects.scss';

class Projects extends Component {
  constructor(props){
    super(props);
  }
  state = {addCollabModal: false, newProjectModal: false};
  componentDidMount() {
    this.props.getProjects(this.props.username);
  }
  handleCollabClick = (user) => {
    //TODO: Navigate to user's page
  };
  toggleModal = (name) => {
    let newState = {};
    newState[`${name}Modal`] = !this.state[`${name}Modal`] || false
    this.setState(newState);
  };
  newSubmit = (name) => {
    this.props.addProject(name, this.props.username);
  };
  openProject = (project) => {
    this.props.history.pushState(null, `/${project.owner.username}/${project.name}`);
  };
  render(){
    let projects = this.props.projects ? this.props.projects.map((project, i) => {
      return (
        <ProjectTile
          key={`${project.name}-Collab-${i}`}
          project={ project }
          onCollabClick={ this.handleCollabClick }
          onAddCollabClick={ this.toggleModal.bind(this, 'addCollab') }
          onSelect={ this.openProject }
        />
      );
    }) : <span>Click the plus to start a project</span>;
    projects.unshift(<NewProjectTile key="Project-New" onClick={ this.toggleModal.bind(this, 'newProject')}/>);
    return (
      <div className="Projects">
        <NewProjectDialog
          open={ this.state.newProjectModal }
          onRequestClose={ this.toggleModal.bind(this, 'newProject') }
          onCreateClick={ this.newSubmit }
        />
        <div className="Projects-Tiles">
          { projects }
        </div>
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  const {
    entities: { projects, accounts }
  } = state;
  let projectsArray = toArray(projects);
  let username = state.router.params.username;
  return {
    account: state.account,
    projects: projectsArray,
    router: state.router,
    username
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects);
