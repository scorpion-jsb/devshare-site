import { toArray } from 'lodash';
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import Paper from 'material-ui/lib/paper';
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
      return renderProjectTile(project, i);
    }) : <span>No Projects</span>;
    return (
      <div className="Projects">
        <h2>Projects page</h2>
        <div className="Projects-Tiles">
          { projects }
        </div>
      </div>
    );
  }
}
function renderProjectTile(project, i) {
  return (
    <Paper key={`Project-${i}`} className="Projects-Tile">
      <Link to={`/projects/${project.name}`}>{ project.name }</Link>
    </Paper>
  );
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  //TODO: LOAD PROJECTS FROM
  return {
    account: state.account,
    projects: toArray(state.entities.projects) || [],
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects);
