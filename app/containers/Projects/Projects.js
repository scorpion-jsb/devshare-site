import { toArray } from 'lodash';
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import Paper from 'material-ui/lib/paper';
import ProjectTile from '../../components/ProjectTile/ProjectTile';
import { Actions } from 'redux-grout';
import './Projects.scss';

class Projects extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    this.props.getProjects();
  }
  render(){
    let projects = this.props.projects ? this.props.projects.map((project, i) => {
      return <ProjectTile project={ project } />
    }) : <span>No Projects</span>;
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
