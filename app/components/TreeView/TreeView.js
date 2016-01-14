import { map, filter } from 'lodash';
import React, { PropTypes, Component } from 'react';
import TreeFolder from '../TreeFolder';
import TreeFile from '../TreeFile';
import Dropzone from 'react-dropzone';
import './TreeView.scss';
const hideCurrentUser = true; //Display current user in file's connected users
class TreeView extends Component {
  constructor() {
    super();
    this.inputKey = null;
  }

  state = {
    contextMenu: {
      display: 'none',
      top: '0px',
      left: '0px'
    },
    selectedPath: ''
  };

  static propTypes = {
    fileStructure: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
    })),
    onFileClick: PropTypes.func,
    onFolderClick: PropTypes.func,
    onAddFileClick: PropTypes.func,
    onAddFolderClick: PropTypes.func,
    projectName: PropTypes.string,
    onFilesDrop: PropTypes.func,
    onFileDelete: PropTypes.func
  };

  handleNewClick = (type) => {
    console.log('selected path', this.state.selectedPath);
    if (type === 'file') {
      this.props.onAddFileClick(this.state.selectedPath);
    }
    if (type === 'folder') {
      this.props.onAddFileClick(this.state.selectedPath);
    }
  };

  handleRightClick = (e) => {
    e.preventDefault();
    let path = this.getPathOfTarget(e.target);
    console.log('this is our path', path);
    this.setState({
      contextMenu: {
        display: 'block',
        top: e.clientY,
        left: e.clientX
      },
      selectedPath: path
    });
    window.addEventListener('click', this.handleWindowClick);
    return false;
  };

  handleWindowClick = () => {
    this.setState({
      contextMenu: {
        display: 'none'
      }
    });
    window.removeEventListener('click', this.handleWindowClick);
  };

  getPathOfTarget = (el) => {
    let i = 0;
    while(el.tagName !== 'LI' && i < 5) {
      el = el.parentNode;
      i++;
    }
    let path = el.getAttribute('data-path');
    const type = el.getAttribute('data-reactid').split('$child-')[1].split('-')[0].toLowerCase();
    if (path.split('/').length < 1) {
      return '/'
    }
    const lastIndex = path.lastIndexOf("/");
    if (lastIndex < 0 && type === 'folder') {
      return `${path}/`;
    }
    return path.substring(0, lastIndex + 1) || '/';
  };

  handleDeleteClick = (e) => {
    e.preventDefault();
    let fileData = this.props.fileStructure[this.inputKey].meta;
    console.log('handle delete click:', fileData);
    if(this.inputKey){
      this.props.onFileDelete({projectName: this.props.projectName, path: fileData.path || fileData.name });
    }
  };

  handleEntryClick = (path) => {
    this.setState({
      selectedPath: path
    });
  };

  render() {
    let structure = this.props.fileStructure.map((entry, i) => {
      //TODO: find error when folder is introduced
      if(entry.meta.type == "folder" || entry.children){
        return (
          <TreeFolder
            key={ `child-Folder-${i}-${entry.meta.name}` }
            index={ i }
            data={ entry.meta }
            isCollapsed={ entry.isCollapsed }
            children={ entry.children }
            onFileClick={ this.props.onFileClick }
          />
        );
      }
      let mappedUsers = entry.users ? map(entry.users, (user, key) => {
        user.username = key;
        return user;
      }) : null;
      // //Remove current user from file's users array
      if(hideCurrentUser && this.props.account && this.props.account.username){
        mappedUsers = mappedUsers ? filter(mappedUsers, (user) => {
          return (user.username !== this.props.account.username);
        }) : null;
      }
      return (
        <TreeFile
          key={ `child-File-${i}-${entry.meta.name || entry.meta.path.split('/')[0]}` }
          index={ i }
          data={ entry.meta }
          active={ entry.active }
          users={ mappedUsers }
          onClick={ this.props.onFileClick }
          data-somedata="asdf"
        />
      );
    });

    var noFiles;
    if (structure.length < 1) {
      noFiles = (
        <li className="TreeView-None" key="NotFound-1">
          <div>
            <strong>Right click</strong><br/>
              OR <br/>
            <strong>Drop files</strong><br/>
              to get started <br/>
          </div>
        </li>
      )
    } else {
      noFiles = null;
    }

    var contextMenuStyle = {
      display: this.state.contextMenu.display,
      top: this.state.contextMenu.top,
      left: this.state.contextMenu.left
    }

    return (
      <div className="TreeView" onContextMenu={ this.handleRightClick }>
        <Dropzone className="TreeView-Dropzone" onDrop={ this.props.onFilesDrop } multiple={ true } style={{ border: 'none' }} disableClick={ true } >
          <div className="TreeView-Container">
            <ol className="TreeView-Structure">
              { noFiles }
              { structure }
            </ol>
            <ul style={ contextMenuStyle } className="TreeView-ContextMenu">
              <li onClick={ this.handleNewClick.bind(this, 'file') }>Add new file</li>
              <li onClick={ this.handleNewClick.bind(this, 'folder') }>Add new folder</li>
              <li onClick={ this.handleDeleteClick }>Delete File</li>
            </ul>
          </div>
        </Dropzone>
      </div>
    );
  }
}

export default TreeView;
