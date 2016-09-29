import React, { Component, PropTypes } from 'react'
import Popover from 'material-ui/Popover/Popover'
import TextField from 'material-ui/TextField'

import classes from './WorkspacePopover.scss'

const originSettings = { horizontal: 'middle', vertical: 'top' }
const pathInputStyling = { padding: 20 }

export default class WorkspacePopover extends Component {

  static propTypes = {
    workspaceElement: PropTypes.object,
    initialPath: PropTypes.string,
    type: PropTypes.oneOf(['file', 'folder']),
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func
  }

  state = {
    activePopover: 'none',
    path: ''
  }

  componentWillReceiveProps (props) {
    if (props.type && props.open) this.show('pop')
  }

  show = (key, e) =>
    this.setState({
      activePopover: key
    }, () => {
      setTimeout(() => {
        if (this.refs.popoverTextField) {
          this.refs.popoverTextField.focus()
        }
      }, 500)
    })

  closePopover = key => {
    if (this.state.activePopover !== key) return
    this.setState({
      activePopover: 'none'
    }, () => {
      this.refs.popoverTextField.blur()
    })
    this.props.onClose()
  }

  onSubmit = (e) => {
    if (e && e.key === 'Enter') {
      this.props.onSubmit(this.props.type, this.state.path)
      this.closePopover('pop')
    }
  }

  handleChange = e =>
    this.setState({ path: e.target.value })

  handleFocus = e => {
    e.target.value = e.target.value
    return e.target.value
  }

  render () {
    const { initialPath, type, workspaceElement } = this.props

    return (
      <Popover className={classes['container']} open={this.state.activePopover === 'pop'}
        anchorEl={workspaceElement}
        anchorOrigin={originSettings}
        targetOrigin={originSettings}
        onRequestClose={this.closePopover.bind(this, 'pop')} >
        <div style={pathInputStyling}>
          <p>Enter path for new {type}</p>
          <TextField
            hintText={initialPath}
            defaultValue={initialPath}
            onChange={this.handleChange}
            ref='popoverTextField'
            name='path'
            onFocus={this.handleFocus}
            onKeyDown={this.onSubmit}
          />
        </div>
      </Popover>
    )
  }
}
