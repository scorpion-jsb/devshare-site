import React, { PropTypes, Component } from 'react'
import classnames from 'classnames'
import { map } from 'lodash'
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right'
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

// Components
import TreeFile from '../TreeFile'

// Styles
import classes from './TreeFolder.scss'

export default class TreeFolder extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    children: PropTypes.object,
    onOpenClick: PropTypes.func,
    onClosedClick: PropTypes.func,
    onFileClick: PropTypes.func,
    onRightClick: PropTypes.func
  }

  state = { isCollapsed: true }

  render () {
    const { data, onFileClick, onRightClick, children } = this.props
    const { isCollapsed } = this.state

    let childList
    if (children) {
      childList = map(children, (entry, key) => {
        if (!entry.meta) {
          let firstChildPath = entry[Object.keys(entry)[0]].meta.path
          let childPathSplit = firstChildPath.split('/')
          entry.meta = {
            entityType: 'folder',
            name: key,
            path: childPathSplit.slice(0, -1).join('/')
          }
        }
        if (entry.meta && (entry.meta.entityType === 'folder')) {
          let itemChildren = Object.assign({}, entry)
          delete itemChildren.key; delete itemChildren.meta
          return (
            <TreeFolder
              key={`child-Folder-${key}-${entry.meta.name}`}
              data={entry.meta}
              isCollapsed={entry.isCollapsed}
              children={itemChildren}
              onFileClick={onFileClick}
              onRightClick={onRightClick}
            />
          )
        }
        return (
          <TreeFile
            key={`child-File-${key}-${entry.meta.name || entry.meta.path.split('/')[0]}`}
            data={entry.meta}
            active={entry.active}
            onClick={onFileClick}
            onRightClick={onRightClick}
            users={entry.users}
          />
        )
      })
    }

    const name = data.name || data.path
    const containerClass = classnames(
      classes['container'],
      isCollapsed ? 'collapsed noselect' : 'noselect'
    )

    return (
      <li data-path={data.path} onContextMenu={this._onRightClick}>
        <div className={containerClass} onClick={this._onFolderClick}>
          {
            isCollapsed
              ? <RightArrow />
              : <DownArrow />
          }
          <span className={classes['name']}>
            {name}
          </span>
        </div>
        {
          !isCollapsed &&
            <ol className={classes['children']}>
              {childList}
            </ol>
        }
      </li>
    )
  }

  _onRightClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onRightClick(this.props.data.path, { x: e.clientX, y: e.clientY })
  }

  _onFolderClick = (e) => {
    if (e.button !== 0) { return }

    // If modified event
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }

    // var el = event.currentTarget
    e.preventDefault()
    this.setState({
      isCollapsed: !this.state.isCollapsed
    })
    if (this.props.onOpenClick && !this.state.isCollapsed) {
      this.props.onOpenClick()
    }
    if (this.props.onClosedClick && this.state.isCollapsed) {
      this.props.onClosedClick()
    }
  }
}
