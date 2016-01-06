import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/lib/paper';
import './ProjectTile.scss';
const stockPhotoUrl = 'https://s3.amazonaws.com/kyper-cdn/img/User.png';
export default class ProjectTile extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
    project: PropTypes.object
  }
  render(){
    let collaborators;
    if(this.props.project.collaborators){
      collaborators = this.props.project.collaborators.map((user, i) => {
        return(
          <div key={`${this.props.project.name}-Collab-${i}`} className="ProjectTile-Collaborator">
            <img className="ProjectTile-Collaborator-Img" src={ user.image ? user.image.url : stockPhotoUrl } />
            <span className="ProjectTile-Collaborator-Username">{ user.username }</span>
          </div>
        );
      });
    }
    return (
      <Paper key={`Project-${this.props.project.name}`} className="ProjectTile">
        <Link className="ProjectTile-Name" to={`/projects/${this.props.project.name}`}>
          { this.props.project.name }
        </Link>
        <span className="ProjectTile-Owner">
          { this.props.project.owner.username || 'No Owner' }
        </span>
        <div className="ProjectTile-Collaborators">
          { collaborators }
        </div>
      </Paper>
    );
  }
}
