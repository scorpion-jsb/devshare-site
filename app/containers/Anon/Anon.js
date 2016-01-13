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
import './Anon.scss';

let CombinedActions = merge(Actions.projects, TabActions);

class Anon extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="Anon">
        <Workspace
          project={ this.props.project }
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
  let name = state.router.params.projectName ? state.router.params.projectName : randomProjectId();
  let owner = 'anon';
  return {
    project: { name, owner },
    router: state.router,
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(CombinedActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Anon);
