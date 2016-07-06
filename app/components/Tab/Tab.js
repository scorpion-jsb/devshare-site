import React, { PropTypes, Component } from 'react'
import FontIcon from 'material-ui/lib/font-icon'

import './Tab.scss'

class Tab extends Component {
  constructor () {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.handleTabClick = this.handleTabClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    active: PropTypes.bool,
    onSelect: PropTypes.func,
    onClose: PropTypes.func
  };
  handleCloseClick (event) {
    this._handleClick()
    if (this.props.onClose) {
      this.props.onClose(this.props.index)
    }
  }
  handleTabClick (event) {
    this._handleClick()
    if (this.props.onSelect) {
      this.props.onSelect(this.props.index)
    }
  }
  render () {
    let className = (this.props.active) ? 'Tab active' : 'Tab'
    const iconSize = '18'
    const iconStyle = {color: '#aaaaaa', fontSize: iconSize}
    return (
      <li className={className}>
        <div className='Tab-Title' onClick={this.handleTabClick}>{this.props.title}</div>
        <div className='Tab-Close' onClick={this.handleCloseClick}>
          <FontIcon className='material-icons'
            style={iconStyle}>
            close
          </FontIcon>
        </div>
        /* TODO: Make tab indicator :after css class*/
        <div className='Tab-Indicator'>
        </div>
      </li>
    )
  }
  // Handle event after click
  _handleClick () {
    if (event.button !== 0) {
      return
    }
    // If modified event
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return
    }
    // Event element
    var el = event.currentTarget
    // Prevent default action
    event.preventDefault()
    return el
  }
}

export default Tab
