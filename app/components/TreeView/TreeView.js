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
    this.state = {
      contextMenu: {
        display: 'none',
        top: '0px',
        left: '0px'
      },
      newFile: false
    };
    this.handleWindowClick = this.handleWindowClick.bind(this);
    this.renderInputDialog = this.renderInputDialog.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNewSubmit = this.handleNewSubmit.bind(this);
    this.addInputBox = this.addInputBox.bind(this);
    this.handleNewFileClick = this.handleNewFileClick.bind(this);
    this.hideNewFileInput = this.hideNewFileInput.bind(this);
    this.inputKey = null;
  }
  static propTypes = {
    fileStructure: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
    })),
    onFileClick: PropTypes.func,
    onFolderClick: PropTypes.func,
    addFile: PropTypes.func,
    projectName: PropTypes.string,
    onFilesDrop: PropTypes.func
  };
  handleNewFileClick() {
    this.setState({
      showNewFile: true
    }, () => {
      this.refs.inputDialog.focus();
      window.addEventListener('keydown', this.hideNewFileInput);
    });
  }
  hideNewFileInput(e) {
    if (e.keyCode == 27) {
      this.setState({
        showNewFile: false
      });
      window.removeEventListener('keydown', this.hideNewFileInput);
    } else if (e === 'blur') {
      this.setState({
        showNewFile: false
      });
    }
  }
  handleRightClick(e) {
    e.preventDefault();
    this.addInputBox(e.target);
    this.setState({
      contextMenu: {
        display: 'block',
        top: e.clientY,
        left: e.clientX
      }
    });
    window.addEventListener('click', this.handleWindowClick);
    return false;
  }
  addInputBox(el) {
    let i = 0;
    while(el.tagName !== 'LI' && i < 5) {
      el = el.parentNode;
      i++;
    }
    let reactId = el.getAttribute('data-reactid');
    let key = reactId.split('-')[2];

    this.inputKey = key;
  }
  handleWindowClick() {
    this.setState({
      contextMenu: {
        display: 'none'
      }
    });
    window.removeEventListener('click', this.handleWindowClick);
  }
  handleInputChange(e) {
    this.setState({
      inputValue: e.target.value
    });
  }
  handleNewSubmit(e) {
    e.preventDefault();
    this.setState({
      showNewFile: false
    });
    this.props.addFile({projectName: this.props.projectName, path: this.state.inputValue});
    return false;
  }
  renderInputDialog(key) {
    if(this.state){
      return (
        <li className="TreeView-NewInput" key={ `child-Folder-${key}-input` }>
          <form onSubmit={ this.handleNewSubmit }>
            <input
              className="Input"
              onChange={ this.handleInputChange }
              ref="inputDialog"
              placeholder="newfile.js"
              onBlur={ this.hideNewFileInput.bind(this, 'blur') }
            />
          </form>
        </li>
      );
    }
  }

  render() {
    let structure = this.props.fileStructure.map((entry, i) => {
      if(entry.meta.type == "folder" || entry.children){
        return (
          <TreeFolder
            key={ `child-Folder-${i}-${entry.meta.name}` }
            index={ i }
            name={ entry.meta.name }
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
      // if(hideCurrentUser){
      //   mappedUsers = mappedUsers ? filter(mappedUsers, (user) => {
      //     return (user.username !== this.props.account.username);
      //   }) : null;
      // }
      return (
        <TreeFile
          key={ `child-File-${i}-${entry.meta.name || entry.meta.path.split('/')[0]}` }
          index={ i }
          data={ entry.meta }
          active={ entry.active }
          users={ mappedUsers }
          onClick={ this.props.onFileClick }
        />
      );
    });
    if (this.inputKey && this.state.showNewFile) {
      let inputDialog = this.renderInputDialog(this.inputKey);
      structure.splice(this.inputKey + 1, 0, inputDialog);
    } else if (this.state.showNewFile) {
      let inputDialog = this.renderInputDialog(this.inputKey);
      structure.push(inputDialog);
    }
    var noFiles;
    if (structure.length < 1) {
      noFiles = (
        <p className="TreeView-None" key="NotFound-1">
          <strong>Right click</strong><br/>
            to get started <br/>
          <strong>OR</strong> <br/>
        </p>
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
      <div className="TreeView">
        <ol className="TreeView-Structure" onContextMenu={ this.handleRightClick.bind(this) }>
          { noFiles }
          { structure }
        </ol>
        <div className="TreeView-Upload">
          <Dropzone onDrop={ this.props.onFilesDrop } multiple={ true }>
            <div className="TreeView-DropZone">Drag to Upload</div>
          </Dropzone>
        </div>
        <ul style={ contextMenuStyle } className="TreeView-ContextMenu">
          <li onClick={ this.handleNewFileClick }>Add new file</li>
          <li>Add new folder</li>
        </ul>
      </div>
    );
  }
}

export default TreeView;
