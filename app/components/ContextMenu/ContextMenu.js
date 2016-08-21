import React, { PropTypes, Component } from 'react'
import './ContextMenu.scss'

class ContextMenu extends Component {

  static propTypes = {
    event: PropTypes.object,
    onAddFileClick: PropTypes.func,
    onAddFolderClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    path: PropTypes.string,
    dismiss: PropTypes.func
  }

  state = {
    contextMenu: {
      display: 'none',
      top: '0px',
      left: '0px'
    }
  }

  componentDidMount () {
    this.handleRightClick()
  }

  handleNewClick = type => {
    let parent = this.getParentOfPath(this.props.path)
    if (type === 'file') {
      this.props.onAddFileClick(parent)
    }
    if (type === 'folder') {
      this.props.onAddFolderClick(parent)
    }
  }

  handleRightClick = () => {
    this.setState({
      contextMenu: {
        top: this.props.position.y,
        left: this.props.position.x
      }
    })
    window.addEventListener('click', this.handleWindowClick)
    return false
  }

  handleWindowClick = () => {
    this.props.dismiss()
    window.removeEventListener('click', this.handleWindowClick)
  }

  getParentOfPath = path => {
    return path ? path.substring(0, path.lastIndexOf('/') + 1) : '/'
  }

  handleDeleteClick = (e) => {
    e.preventDefault()
    this.props.onFileDelete(this.props.path)
  }

  render () {
    var contextMenuStyle = {
      top: this.state.contextMenu.top,
      left: this.state.contextMenu.left
    }

    return (
      <ul style={contextMenuStyle} className='ContextMenu'>
        <li onClick={this.handleNewClick.bind(this, 'file')}>Add new file</li>
        <li onClick={this.handleNewClick.bind(this, 'folder')}>Add new folder</li>
        {this.props.path && <li onClick={this.handleDeleteClick}>Delete</li>}
      </ul>
    )
  }
}

export default ContextMenu
