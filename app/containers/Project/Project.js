import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'redux-grout';
import './Project.scss';

class Project extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="Project">
        <span> Name: {this.props.project.name || 'No Name'}</span>
        <span> Owner: {this.props.project.owner.username || 'No Name'}</span>
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  let project;
  if(state.entities && state.entities.projects && state.router.params.projectName){
    state.entities.projects[state.router.params.projectName];
  }
  return {
    project,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
