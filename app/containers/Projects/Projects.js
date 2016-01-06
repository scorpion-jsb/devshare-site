import { toArray } from 'lodash';
import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ProjectTile from '../../components/ProjectTile/ProjectTile';
import NewProjectTile from '../../components/NewProjectTile/NewProjectTile';
import { Actions } from 'redux-grout';
import './Projects.scss';

class Projects extends Component {
  constructor(props){
    super(props);
    this.handleCollabClick = this.handleCollabClick.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {addCollabModal: false, newProjectModal: false};
  }
  componentDidMount() {
    this.props.getProjects();
  }
  handleCollabClick(user) {
    if(this.props && this.props.onCollabClick) {
      this.props.onCollabClick(user);
    }
  }
  toggleModal(name) {
    this.setState({
      name: !this.state[`${name}Modal`] || false
    });
  }
  newClick(projectData) {
    this.props.addProject(projectData);
  }
  render(){
    let projects = this.props.projects ? this.props.projects.map((project, i) => {
      return (
        <ProjectTile
          key={`${project.name}-Collab-${i}`}
          project={ project }
          onCollabClick={ this.handleCollabClick }
          onAddCollabClick={ this.toggleModal.bind(this, 'addCollab') }
        />
      );
    }) : <span>Click the plus to start a project</span>;
    projects.unshift(<NewProjectTile key="Project-New" onClick={ this.newClick}/>);
    return (
      <div className="Projects">
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
  //Populate project owners and collaborators
  if(accounts){
    projectsArray.map((project) => {
      if(project.owner){
        project.owner = accounts[project.owner] || project.owner;
      }
      if(project.collaborators){
        project.collaborators = project.collaborators.map((userId) => {
          return accounts[userId] || userId;
        });
      }
      return project;
    });
  }
  return {
    account: state.account,
    projects: projectsArray,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects);
