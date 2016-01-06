import React, { PropTypes, Component } from 'react';
import FontIcon from 'material-ui/lib/font-icon';
//Components
import TreeFile from '../TreeFile';

//Styles
import './TreeFolder.scss';

class TreeFolder extends Component {
  constructor() {
    super();
    this._onFolderClick = this._onFolderClick.bind(this);
    //TODO: Load this from redux
    this.state = {isCollapsed: true};
  }
  static propTypes = {
    data: PropTypes.object,
    index: PropTypes.number.isRequired,
    onOpenClick: PropTypes.func,
    onClosedClick: PropTypes.func,
    onFileClick: PropTypes.func
  }
  render() {
    let className = (this.state.isCollapsed) ? 'TreeFolder collapsed noselect' : 'TreeFolder noselect';
    const iconSize = "1.7rem";
    // let iconClass = (this.state.isCollapsed) ? 'octicon octicon-chevron-right ' : 'octicon octicon-chevron-down TreeFolder-Icon';
    let children;
    if(this.props.children){
      children = this.props.children.map((entry, i) => {
        if(entry.type == "folder" || entry.children){
          return (
            <TreeFolder
              key={ `${this.props.name}-Folder-${i}` }
              index={ i }
              data={ entry.meta }
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
    }
    const name = this.props.data.name || this.props.data.path;
    if(this.state.isCollapsed) {
      return (
        <li className={ className }>
          <div className="TreeFolder-Info" onClick={ this._onFolderClick }>
            <FontIcon className="material-icons"
              style={{ 'fontSize': iconSize}}>
              keyboard_arrow_down
            </FontIcon>
            <span className="TreeFolder-Name">{ name }</span>
          </div>
        </li>
      );
    } else {
      return (
        <li className={ className }>
          <div className="TreeFolder-Info" onClick={ this._onFolderClick }>
            <FontIcon className="material-icons"
              style={{ 'fontSize': iconSize}}>
              keyboard_arrow_right
            </FontIcon>
            <span className="TreeFolder-Name">{ name }</span>
          </div>
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
