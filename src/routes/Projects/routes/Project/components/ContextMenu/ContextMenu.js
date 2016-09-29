import React, { PropTypes, Component } from 'react'
import classes from './ContextMenu.scss'

export default class ContextMenu extends Component {

  static propTypes = {
    event: PropTypes.object,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    path: PropTypes.string,
    dismiss: PropTypes.func,
    onAddFileClick: PropTypes.func,
    onAddFolderClick: PropTypes.func,
    onFileDelete: PropTypes.func
  }

  state = {
    contextMenu: {
      display: 'none',
      top: '0px',
      left: '0px'
    }
  }

  componentDidMount () {
    this.setupRightClick()
  }

  setupRightClick = () => {
    this.setState({
      contextMenu: {
        top: this.props.position.y,
        left: this.props.position.x
      }
    })
    window.addEventListener('click', this.windowClick)
  }

  windowClick = () => {
    this.props.dismiss()
    window.removeEventListener('click', this.windowClick)
  }

  deleteClick = (e) => {
    e.preventDefault()
    this.props.onFileDelete(this.props.path)
  }

  render () {
    const {
      path,
      onAddFileClick,
      onAddFolderClick
    } = this.props

    const parent = path
      ? path.substring(0, path.lastIndexOf('/') + 1)
      : '/'

    // TODO: find a cleaner way to do this
    const menuLocation = {
      top: parseInt(this.state.contextMenu.top) - 63, // Subtract the height of the navbar
      left: this.state.contextMenu.left
    }

    return (
      <ul style={menuLocation} className={classes['container']}>
        <li onClick={() => onAddFileClick(parent)}>
          Add new file
        </li>
        <li onClick={() => onAddFolderClick(parent)}>
          Add new folder
        </li>
        {
          path &&
            <li onClick={this.deleteClick}>
              Delete
            </li>
        }
      </ul>
    )
  }
}
