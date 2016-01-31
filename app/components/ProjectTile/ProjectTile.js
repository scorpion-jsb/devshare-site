import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import PersonIcon from 'material-ui/lib/svg-icons/social/person';
import PersonAddIcon from 'material-ui/lib/svg-icons/social/person-add';
import './ProjectTile.scss';

export default class ProjectTile extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
    project: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onAddCollabClick: PropTypes.func
  };

  handleSelect = (e) => {
    e.preventDefault();
    this.props.onSelect(this.props.project);
  };

  addClick = (e) => {
    e.preventDefault();
    if(this.props.onAddCollabClick){
      this.props.onAddCollabClick();
    }
  };

  render(){
    const { collaborators, name, owner } = this.props.project;
    const personIconStyle = { width: '50%', height: '75%' };
    let collaboratorsList = [];
    if(collaborators){
      collaboratorsList = collaborators.map((user, i) => {
        return(
          <div key={`${name}-Collab-${i}`} className="ProjectTile-Collaborator">
            <Avatar
              className="ProjectTile-Collaborator-Avatar"
              src={ (user.image && user.image.url) ? user.image.url : null }
              icon={ <PersonIcon style={ personIconStyle }/> }
              size={ 60 }
            />
          </div>
        );
      });
    }
    if(this.props.onAddCollabClick){
      collaboratorsList.push((
        <div key={`${name}-Add-Collab`} className="ProjectTile-Collaborator" onClick={ this.addClick }>
          <Avatar
            className="ProjectTile-Collaborator-Avatar"
            icon={ <PersonAddIcon style={ personIconStyle }/> }
            size={ 60 }
          />
        </div>
      ));
    }
    return (
      <Paper key={`Project-${name}`} className="ProjectTile">
        <span className="ProjectTile-Name" onClick={ this.handleSelect }>
          { this.props.project.name }
        </span>
        <span className="ProjectTile-Owner">
          { (owner && owner.username) ?  owner.username : 'No Owner' }
        </span>
        <div className="ProjectTile-Collaborators">
          { collaboratorsList }
        </div>
      </Paper>
    );
  }
}
