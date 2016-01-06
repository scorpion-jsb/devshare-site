import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'redux-grout';
import Workspace from '../Workspace/Workspace';

import './Project.scss';

class Project extends Component {
  constructor(props){
    super(props);
    this.selectProject = this.selectProject.bind(this);
  }
  componentDidMount() {
    if(!this.props.projects){
      this.props.getProjects();
    }
  }
  selectProject(name) {
    console.log('new project selected', name);
    this.props.history.pushState(null, `/projects/${name}`);
  }
  render(){
    return (
      <div className="Project">
        <Workspace
          projectName={ this.props.projectName }
          showButtons={ true }
          onProjectSelect={ this.selectProject }
        />
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    projectName: state.router.params.projectName,
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
