import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
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
    console.log('this.props.projects', this.props.projects);
    let projects = this.props.projects ? this.props.projects.map((project) => {
      return (<Paper>{ project.name }</Paper>);
    }) : <span>No Projects</span>;
    return (
      <div className="Projects">
        <h2>Projects page</h2>
        { projects }
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    projects: state.entities.projects,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects);
