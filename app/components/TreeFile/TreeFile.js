import { map, first } from 'lodash';
import React, { PropTypes, Component } from 'react';
import './TreeFile.scss';

class TreeFile extends Component {
  constructor() {
    super();
    this._onFileClick = this._onFileClick.bind(this);
  }
  static propTypes = {
    name: PropTypes.string,
    index: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
  };
  render() {
    let className = (this.props.active) ? 'TreeFile active noselect' : 'TreeFile noselect';
    let name = this.props.data.name || this.props.data.path.split('/')[this.props.data.path.split('/').length - 1];
    let connectedUsers = this.props.users ? this.props.users.map((user, i) => {
      const userStyle = {backgroundColor: user.color};
      return <div key={`Connected-User-${i}`} className="TreeFile-User" style={userStyle}>{user.username.charAt(0).toUpperCase()}</div>;
    }) : <span></span>;
    return (
      <li onClick={ this._onFileClick }>
        <div className={ className }>
          <span className="TreeFile-Name">{ name }</span>
          <div className="TreeFile-Users">{ connectedUsers }</div>
        </div>
      </li>
    );
  }
  _onFileClick(event) {
    if (event.button !== 0) {
      return;
    }
    // If modified event
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    var el = event.currentTarget;
    event.preventDefault();
    if(this.props){
      if(this.props.onClick){
        console.log('running on click in tree file:', this.props.data);
        this.props.onClick(this.props.data);
      }
    }
  }
}

export default TreeFile;
