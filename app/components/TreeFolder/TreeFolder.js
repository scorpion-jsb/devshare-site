import React, { PropTypes, Component } from 'react';

//Components
import TreeFile from '../TreeFile';

//Styles
import './TreeFolder.scss';

class TreeFolder extends Component {
  constructor() {
    super();
    this._onFolderClick = this._onFolderClick.bind(this);
    this.createIcon = this.createIcon.bind(this);
    //TODO: Load this from redux
    this.state = {isCollapsed: true};
  }
  static propTypes = {
    name: PropTypes.string,
    index: PropTypes.number.isRequired,
    onOpenClick: PropTypes.func,
    onClosedClick: PropTypes.func,
    onFileClick: PropTypes.func
  }
  createIcon() {
    let iconSize = "15";
    if(this.state.isCollapsed){
      return (
        <div className="TreeFolder-Icon">
          >
        </div>
      );
    } else {
      return (
        <div className="TreeFolder-Icon">
          ^
        </div>
      )
    }
  }
  createElmTree(childList){

  }
  render() {
    let className = (this.state.isCollapsed) ? 'TreeFolder collapsed noselect' : 'TreeFolder noselect';
    // let iconClass = (this.state.isCollapsed) ? 'octicon octicon-chevron-right ' : 'octicon octicon-chevron-down TreeFolder-Icon';
    let iconElement = this.createIcon();

    let children = this.props.children.map((entry, i) => {
      if(entry.type == "folder" || entry.children){
        return (
          <TreeFolder
            key={ `${this.props.name}-Folder-${i}` }
            index={ i }
            name={ entry.name }
            isCollapsed={ entry.isCollapsed }
            children={ entry.children }
            onFileClick={ this.props.onFileClick }
          />
        );
      }
      return (
        <TreeFile
          key={ `${this.props.name}-File-${i}` }
          index={ i }
          data={ entry }
          active={ entry.active }
          onClick={ this.props.onFileClick }
        />
      );
    });
    if(this.state.isCollapsed) {
      return (
          <li className={ className }>
            <div onClick={ this._onFolderClick }>{ iconElement }{ this.props.name }</div>
          </li>
        );
    } else {
      return (
          <li className={ className }>
            <div onClick={ this._onFolderClick }>{ iconElement }{ this.props.name }</div>
            <ol className="TreeFolder-Children">
              { children }
            </ol>
          </li>
        );
    }

  }
  _onFolderClick(event) {
    if (event.button !== 0) {
      return;
    }
    // If modified event
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    var el = event.currentTarget;
    event.preventDefault();
    this.setState({
      isCollapsed: !this.state.isCollapsed
    });
    if(this.props){
      if(this.props.onOpenClick && !this.state.isCollapsed){
        // console.log('open folder clicked');
        this.props.onOpenClick();
      }
      if(this.props.onClosedClick && this.state.isCollapsed){
        // console.log('closed folder clicked');
        this.props.onClosedClick();
      }
    }
  }
}

export default TreeFolder;
