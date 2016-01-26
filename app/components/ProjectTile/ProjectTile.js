import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import PersonIcon from 'material-ui/lib/svg-icons/social/person';

import './ProjectTile.scss';
const stockPhotoUrl = 'https://s3.amazonaws.com/kyper-cdn/img/User.png';
export default class ProjectTile extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
    project: PropTypes.object,
    onSelect: PropTypes.func
  };
  handleSelect = (e) => {
    e.preventDefault();
    if(this.props && this.props.onSelect){
      this.props.onSelect(this.props.project);
    }
  };
  render(){
    let collaborators;
    if(this.props.project.collaborators){
      collaborators = this.props.project.collaborators.map((user, i) => {
        return(
          <div key={`${this.props.project.name}-Collab-${i}`} className="ProjectTile-Collaborator">
            <Avatar
              className="ProjectTile-Collaborator-Avatar"
              src={ (user.image && user.image.url) ? user.image.url : null }
              icon={ <PersonIcon style={{width: '50%', height: '75%'}}/> }
              size={60}
            />
          </div>
        );
      });
    }
    return (
      <Paper key={`Project-${this.props.project.name}`} className="ProjectTile">
        <span className="ProjectTile-Name" onClick={ this.handleSelect }>
          { this.props.project.name }
        </span>
        <span className="ProjectTile-Owner">
          { (this.props.project.owner && this.props.project.owner.username) ?  this.props.project.owner.username : 'No Owner' }
        </span>
        <div className="ProjectTile-Collaborators">
          { collaborators }
        </div>
      </Paper>
    );
  }
}
