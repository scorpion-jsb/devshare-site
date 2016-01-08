import {merge} from 'lodash';
import React, { Component } from 'react';
import { randomProjectId } from '../../helpers';
import { Link } from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Actions } from 'redux-grout';
import * as TabActions from '../../actions/tabs';
import Pane from '../../components/Pane/Pane';
import Workspace from '../Workspace/Workspace';
import './Try.scss';

let CombinedActions = merge(Actions.projects, TabActions);

class Try extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="Try">
        <Workspace
          projectName={ this.props.projectName }
          showProjects={ false }
          showButtons={ true }
          hideName={ false }
        />
      </div>
    )
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    projectName: state.router.params.projectName || randomProjectId(),
    router: state.router,
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(CombinedActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Try);
