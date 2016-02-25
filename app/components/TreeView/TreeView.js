import { map, filter, merge, isArray } from 'lodash';
import React, { PropTypes, Component } from 'react';
import TreeFolder from '../TreeFolder';
import TreeFile from '../TreeFile';
import CircularProgress from 'material-ui/lib/circular-progress';
import './TreeView.scss';

class TreeView extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    fileStructure: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
    })),
    onFileClick: PropTypes.func,
    onFolderClick: PropTypes.func,
    projectName: PropTypes.string,
    loading: PropTypes.bool,
    onRightClick: PropTypes.func
  };

  render() {
    let loading = false;
    if (this.props.fileStructure === null || this.props.loading) {
      loading = true;
    }

    let structure = this.props.fileStructure ? this.props.fileStructure.map((entry, i) => {
        if (!entry.meta) {
          let firstChildPath = entry[Object.keys(entry)[0]].meta.path;
          let childPathSplit = firstChildPath.split('/');
          entry.meta = {
            entityType: 'folder',
            name: entry.key,
            path: childPathSplit.slice(0, -1).join('/')
          }
        }
      if (entry.meta && (entry.meta.entityType === 'folder')){
        let children = merge({}, entry);
        delete children.key; delete children.meta;
        return (
          <TreeFolder
            key={ `child-Folder-${i}-${entry.meta.name}` }
            index={ i }
            data={ entry.meta }
            isCollapsed={ entry.isCollapsed }
            children={ children }
            onFileClick={ this.props.onFileClick }
            onRightClick={ this.props.onRightClick }
          />
        );
      }
      return (
        <TreeFile
          key={ `child-File-${i}-${entry.meta.name || entry.meta.path.split('/')[0]}` }
          index={ i }
          data={ entry.meta }
          active={ entry.active }
          onClick={ this.props.onFileClick }
          onRightClick={ this.props.onRightClick }
          users={ entry.users }
        />
      );
    }) : [];

    var noFiles;
    if (structure.length < 1 && !loading) {
      noFiles = (
        <div className="TreeView-None" key="NotFound-1">
          <div>
            <strong>Right click</strong><br/>
              OR <br/>
            <strong>Drop files</strong><br/>
              to get started <br/>
          </div>
        </div>
      )
    } else {
      noFiles = null;
    }

    return (
      <div className="TreeView">
        <div className="TreeView-Container">
          <ol className="TreeView-Structure">
            { structure }
          </ol>
          { noFiles }
          <div className="TreeView-Loader" style={ loading ? {display: 'block'} : {display: 'none'}}>
            <CircularProgress size={.75} />
          </div>
        </div>
      </div>
    );
  }
}

export default TreeView;
