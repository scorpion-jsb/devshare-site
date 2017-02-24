import { map } from 'lodash'
import React, { PropTypes, Component } from 'react'
import classes from './TreeFile.scss'

export default class TreeFile extends Component {

  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.object.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    users: PropTypes.object,
    onRightClick: PropTypes.func
  }

  onFileClick = (e) => {
    if (e.button !== 0) { return }

    // If modified event
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }

    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick(this.props.data)
    }
  }

  rightClick = (e) => {
    e.preventDefault()
    e.stopPropagation() // keep click from running sidebar context menu click
    this.props.onRightClick(this.props.data.path, {x: e.clientX, y: e.clientY})
  }

  render () {
    const { users, data: { name, path } } = this.props

    const userBlocks = users ? map(users, (user, key) => {
      user.username = key
      const userStyle = { backgroundColor: user.color }
      return (
        <div key={`Connected-User-${key}`} className={classes['user']} style={userStyle}>
          {user.username.charAt(0).toUpperCase()}
        </div>
      )
    }) : null

    const fileName = name || path.split('/')[path.split('/').length - 1]

    return (
      <li onContextMenu={this.rightClick}>
        <div
          className={classes['container']}
          onClick={this.onFileClick}
          data-path={path}>
          <span className={classes['name']}>
            {fileName}
          </span>
        </div>
        <div className={classes['users']}>
          {userBlocks}
        </div>
      </li>
    )
  }
}
