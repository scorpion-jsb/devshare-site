import React, { PropTypes, Component } from 'react'
import { each, omit, findIndex, map, last } from 'lodash'

import TreeFolder from '../../components/TreeFolder'
import TreeFile from '../../components/TreeFile'
import CircularProgress from 'material-ui/CircularProgress'
import classes from './TreeView.scss'

// redux-devsharev3
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as TabActions } from '../../modules/tabs'
import { devshare, helpers } from 'redux-devshare'
const { isLoaded, isEmpty, dataToJS } = helpers

const fileEntityBlackList = ['.DS_Store', 'node_modules']

@devshare(
  ({ project }) =>
    ([
      `files/${project.owner}/${project.name}`
    ])
)
@connect(
  ({ devshare, tabs }, { project: { name, owner } }) =>
    ({
      tabs: tabs[`${owner}/${name}`] && tabs[`${owner}/${name}`].list ? tabs[`${owner}/${name}`].list : [],
      files: map(
        dataToJS(devshare, `files/${owner}/${name}`),
        (file, key) => Object.assign(file, { key })
      )
    }),
  // Map dispatch to props
  (dispatch) =>
    bindActionCreators(TabActions, dispatch)
)
export default class TreeView extends Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    files: PropTypes.array,
    tabs: PropTypes.array.isRequired,
    openTab: PropTypes.func.isRequired,
    navigateToTab: PropTypes.func.isRequired,
    fileStructure: PropTypes.arrayOf(PropTypes.shape({
      meta: PropTypes.shape({
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
      })
    })),
    onRightClick: PropTypes.func
  }

  openFile = file => {
    const { project, tabs } = this.props
    const tabData = {
      title: file.name || file.path.split('/')[file.path.split('/').length - 1],
      type: 'file',
      file
    }

    // Search for already matching path
    const matchingInd = findIndex(tabs, (t) => t.file.path === tabData.file.path)
    // console.log('matching index:', tabs, tabData, matchingInd, )
    // Only open tab if file is not already open
    if (matchingInd === -1) {
      this.props.openTab(project, tabData)
      // Select last tab
      return this.props.navigateToTab(project)
    }

    this.props.navigateToTab(project, matchingInd)
  }

  onFilesAdd = (e) => {
    e.preventDefault()
    each(e.target.files, item => {
      if (fileEntityBlackList.indexOf(last(item.webkitRelativePath.split('/'))) !== -1) {
        return void 0
      }
      this.readAndSaveFileEntry(item)
    })
  }

  getStructure = () => {
    if (!this.props.files || !this.props.files.length) return null
    return this.props.files.map((entry, i) => {
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
            key={`child-Folder-${i}-${entry.meta.name}`}
            index={i}
            data={entry.meta}
            isCollapsed={entry.isCollapsed}
            children={children}
            onFileClick={this.openFile}
            onRightClick={this.props.onRightClick}
          />
        )
      }

      // File
      return (
        <TreeFile
          key={`child-File-${i}-${entry.meta.name || entry.meta.path.split('/')[0]}`}
          index={i}
          data={entry.meta}
          active={entry.active}
          onClick={this.openFile}
          onRightClick={this.props.onRightClick}
          users={entry.users}
        />
      )
    })
  }

  render () {
    const { files } = this.props
    const structure = this.getStructure()
    if (!isLoaded(files)) {
      return (
        <div className={classes['container']}>
          <div className={classes['wrapper']}>
            <div className={classes['loader']}>
              <CircularProgress size={0.75} />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={classes['container']}>
        <div className={classes['wrapper']}>
          {
            !isEmpty(files)
            ? (
              <ol className={classes['structure']}>
                {structure}
              </ol>
              )
            : (
              <div className={classes['none']} key='NotFound-1'>
                <div className={classes['none-desktop']}>
                  <span><strong>Right click</strong></span>
                  <span className=''>OR</span>
                  <strong>Drop files</strong>
                  <span>to get started</span>
                </div>
                <div className={classes['none-mobile']}>
                  <span>Touch the Plus to get started</span>
                </div>
              </div>
              )
          }
        </div>
      </div>
    )
  }
}
