import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { Actions } from '../../actions/project';
import './Project.scss';

class Project extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="Project">
        <span> Name: {this.props.project.name}</span>
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    project: state.projects[state.router.params.appName],
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
