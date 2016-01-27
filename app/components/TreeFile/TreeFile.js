import { map, first } from 'lodash';
import React, { PropTypes, Component } from 'react';
import './TreeFile.scss';

export default class TreeFile extends Component {
  constructor() {
    super();
  }
  static propTypes = {
    name: PropTypes.string,
    index: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
  };
  onFileClick = (e) => {
    if (e.button !== 0) {
      return;
    }
    // If modified event
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
      return;
    }
    var el = e.currentTarget;
    e.preventDefault();
    if(this.props && this.props.onClick){
      this.props.onClick(this.props.data);
    }
  };
  render() {
    const className = (this.props.active) ? 'TreeFile active noselect' : 'TreeFile noselect';
    const name = this.props.data.name || this.props.data.path.split('/')[this.props.data.path.split('/').length - 1];
    let connectedUsers = this.props.users ? this.props.users.map((user, i) => {
      const userStyle = { backgroundColor: user.color };
      return <div key={`Connected-User-${i}`} className="TreeFile-User" style={ userStyle }>{ user.username.charAt(0).toUpperCase() }</div>;
    }) : <span></span>;
    return (
      <li onClick={ this.onFileClick } data-path={ this.props.data.path }>
        <div className={ className }>
          <span className="TreeFile-Name">{ name }</span>
          <div className="TreeFile-Users">{ connectedUsers }</div>
        </div>
      </li>
    );
  }
}
