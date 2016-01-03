import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'redux-grout';
import Workspace from '../Workspace/Workspace';
import './Project.scss';

class Project extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="Project">
        <Workspace
          projectName={ this.props.projectName }
          showButtons={ true }
          hideName={ false }
        />
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
