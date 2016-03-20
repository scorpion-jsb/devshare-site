import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'redux-grout'
import Workspace from '../Workspace/Workspace'
import {
  toArray
} from 'lodash'
import './Project.scss'

class Project extends Component {
  constructor (props){
    super(props)
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    if (this.props.account.username && !this.props.projects && this.props.username !== 'anon') {
      //Load all projects if user is logged in
      this.props.getProjects(this.props.account.username);
    } else {
      //Load only single project if user is not logged in
      this.props.getProject(this.props.username, this.props.projectname);
    }
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.account.username && this.props.account.username !== nextProps.account.username) {
      this.props.getProjects(nextProps.account.username);
    }
  }

  selectProject = (proj) => {
    if (proj.owner) {
      this.context.router.push(`/${proj.owner.username}/${proj.name}`);
    }
  };

  render () {
    return (
      <div className="Project">
        <Workspace
          project={ this.props.project }
          showButtons={ true }
          onProjectSelect={ this.selectProject }
        />
      </div>
    )
  }
}
// Place state of redux store into props of component
function mapStateToProps (state) {
  const pathname = decodeURIComponent(state.router.location.pathname);
  const username = pathname.split('/')[1];
  const projectname = pathname.split('/')[2];
  const key = username ? `${username}/${projectname}` : projectname;
  const project = (state.entities && state.entities.projects && state.entities.projects[key]) ? state.entities.projects[key] : { owner: { username }, name: projectname};
  return {
    username,
    projectname,
    project,
    account: state.account,
    router: state.router
  };
}
// Place action methods into props
function mapDispatchToProps (dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
