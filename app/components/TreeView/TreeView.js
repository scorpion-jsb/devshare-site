import { omit } from 'lodash'
import React, { PropTypes, Component } from 'react'
import TreeFolder from '../TreeFolder'
import TreeFile from '../TreeFile'
import CircularProgress from 'material-ui/lib/circular-progress'
import './TreeView.scss'

export default class TreeView extends Component {
  constructor () {
    super()
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
  }

  getStructure = () => {
    if (!this.props.fileStructure || !this.props.fileStructure.length) return null
    return this.props.fileStructure.map((entry, i) => {
      // no metadata
      if (!entry.meta) {
        const firstChildPath = entry[Object.keys(entry)[0]].meta.path
        const childPathSplit = firstChildPath.split('/')
        entry.meta = {
          entityType: 'folder',
          name: entry.key,
          path: childPathSplit.slice(0, -1).join('/')
        }
      }
      // Folder
      if (entry.meta && (entry.meta.entityType === 'folder')) {
        const children = Object.assign({}, omit(entry, ['key', 'meta']))
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
        )
      }
      // File
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
      )
    })
  }

  render () {
    let loading = false
    if (this.props.fileStructure === null || this.props.loading) {
      loading = true
    }
    const structure = this.getStructure()
    return (
      <div className='TreeView'>
        <div className='TreeView-Container'>
          {
            (structure && !this.props.loading)
            ? <ol className='TreeView-Structure'>
                { structure }
              </ol>
            : null
          }
          {
            (!structure && !loading)
            ? (
                <div className='TreeView-None' key='NotFound-1'>
                  <div>
                    <span><strong>Right click</strong></span>
                    <span>OR</span>
                    <strong>Drop files</strong>
                    <span>to get started</span>
                  </div>
                </div>
              )
            : null
          }
          {
            loading
            ? <div className='TreeView-Loader' style={ loading ? {display: 'block'} : {display: 'none'}}>
                <CircularProgress size={ 0.75 } />
              </div>
            : null
          }
        </div>
      </div>
    )
  }
}
