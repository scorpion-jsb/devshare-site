import React, { PropTypes, Component } from 'react'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import classnames from 'classnames'
import classes from './Tab.scss'

export default class Tab extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    active: PropTypes.bool,
    onSelect: PropTypes.func,
    onClose: PropTypes.func
  };

  handleCloseClick = e => {
    this._handleClick(e)
    if (this.props.onClose) {
      this.props.onClose(this.props.index)
    }
  }

  handleTabClick = e => {
    this._handleClick(e)
    if (this.props.onSelect) {
      this.props.onSelect(this.props.index)
    }
  }

  render () {
    const iconSize = 18
    const iconStyle = { color: '#aaaaaa', fontSize: iconSize }
    const { active, title } = this.props
    return (
      <li className={classnames(classes.container, active && classes.active)}>
        <div className={classes.title} onClick={this.handleTabClick}>
          {title}
        </div>
        <div className={classes.close} onClick={this.handleCloseClick}>
          <CloseIcon style={iconStyle} />
        </div>
        {/* TODO: Make tab indicator :after css class */}
        <div className={classes.indicator} />
      </li>
    )
  }

  // Handle event after click
  _handleClick = (event) => {
    if (event.button !== 0) {
      return
    }
    // If modified event
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return
    }
    // Prevent default action
    event.preventDefault()
  }
}
