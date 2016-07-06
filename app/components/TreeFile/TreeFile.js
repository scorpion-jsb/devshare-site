import { map } from 'lodash'
import React, { PropTypes, Component } from 'react'
import './TreeFile.scss'

export default class TreeFile extends Component {

  static propTypes = {
    name: PropTypes.string,
    index: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    users: PropTypes.object,
    onRightClick: PropTypes.func
  }

  onFileClick = (e) => {
    if (e.button !== 0) {
      return
    }
    // If modified event
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
      return
    }
    // var el = e.currentTarget
    e.preventDefault()
    if (this.props && this.props.onClick) {
      this.props.onClick(this.props.data)
    }
  }

  handleRightClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onRightClick(this.props.data.path, {x: e.clientX, y: e.clientY})
  }

  render () {
    const { users, data } = this.props
    let userBlocks = users ? map(users, (user, key) => {
      user.username = key
      const userStyle = { backgroundColor: user.color }
      return (
        <div key={`Connected-User-${key}`} className='TreeFile-User' style={userStyle}>
          {user.username.charAt(0).toUpperCase()}
        </div>
      )
    }) : <span></span>
    // const className = active
    //   ? 'TreeFile active noselect'
    //   : 'TreeFile noselect'
    const name = data.name || data.path.split('/')[data.path.split('/').length - 1]
    return (
      <li onContextMenu={this.handleRightClick}>
        <div className='TreeFile' onClick={this.onFileClick} data-path={data.path}>
          <span className='TreeFile-Name'>{name}</span>
        </div>
        <div className='TreeFile-Users'>{userBlocks}</div>
      </li>
    )
  }
}
