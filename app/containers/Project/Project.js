import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'redux-grout';
import Workspace from '../Workspace/Workspace';

import './Project.scss';

class Project extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    if(!this.props.projects){
      this.props.getProjects(this.props.account.username);
    }
  }

  selectProject = (proj) => {
    this.props.history.pushState(null, `/${proj.owner.username}/${proj.name}`);
  };

  render(){
    return (
      <div className="Project">
        <Workspace
          project={ this.props.project }
          showButtons={ true }
          onProjectSelect={ this.selectProject }
        />
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  let name = state.router.params.projectName;
  let owner = state.router.params.owner;
  return {
    project: { name, owner },
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
