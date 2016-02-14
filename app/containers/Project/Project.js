import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'redux-grout';
import Workspace from '../Workspace/Workspace';
import {
  toArray
} from 'lodash';
import './Project.scss';

class Project extends Component {
  constructor(props){
    super(props);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    if(!this.props.projects && this.props.username !== 'anon'){
      this.props.getProjects(this.props.project.owner.username);
    }
  }

  selectProject = (proj) => {
    if (proj.owner) {
      this.context.router.push(`/${proj.owner.username}/${proj.name}`);
    }
  };

  render(){
    console.log('here comes new project', this.props.project.name);
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
  const pathname = decodeURIComponent(state.router.location.pathname);
  const username = pathname.split('/')[1];
  const name = pathname.split('/')[2];
  const key = username ? `${username}/${name}` : name;
  const project = (state.entities && state.entities.projects && state.entities.projects[key]) ? state.entities.projects[key] : { name, owner: { username } };
  return {
    username,
    project,
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
