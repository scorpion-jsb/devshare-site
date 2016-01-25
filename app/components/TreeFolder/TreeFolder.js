import React, { PropTypes, Component } from 'react';
import { map } from 'lodash';
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
    index: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    onOpenClick: PropTypes.func,
    onClosedClick: PropTypes.func,
    onFileClick: PropTypes.func
  };
  render() {
    let className = (this.state.isCollapsed) ? 'TreeFolder collapsed noselect' : 'TreeFolder noselect';
    const iconSize = "1.2rem";
    // let iconClass = (this.state.isCollapsed) ? 'octicon octicon-chevron-right ' : 'octicon octicon-chevron-down TreeFolder-Icon';
    let children;
    if(this.props.children) {
      let i = 0;
      children = map(this.props.children, (entry) => {
        if(entry.meta && (entry.meta.entityType === 'folder')){
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
            data={ entry.meta }
            active={ entry.active }
            onClick={ this.props.onFileClick }
          />
        );
      });
    }
    const name = this.props.data.name || this.props.data.path;
    return (
      <li className={ className } data-path={ this.props.data.path }>
        <div className="TreeFolder-Info" onClick={ this._onFolderClick }>
          <FontIcon className="material-icons"
            style={{ 'fontSize': iconSize}}>
            { !this.state.isCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_right' }
          </FontIcon>
          <span className="TreeFolder-Name">{ name }</span>
        </div>
        { !this.state.isCollapsed &&
          <ol className="TreeFolder-Children">
            { children }
          </ol>
        }
      </li>
    );
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
