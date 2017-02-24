import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import classes from './NewProjectDialog.scss'

export default class NewProjectDialog extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onCreateClick: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
  }

  state = { open: this.props.open || false }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open) {
      this.setState({
        open: true
      })
      setTimeout(() => {
        if (this.refs && this.refs.projectNameField) {
          this.refs.projectNameField.focus()
        }
      }, 500)
    }
  }

  handleInputChange = (name, e) => {
    e.preventDefault()
    this.setState({
      [name]: e.target.value,
      error: null
    })
  }

  handleSubmit = e => { // eslint-disable-line consistent-return
    e.preventDefault()
    const { name } = this.state
    if (name.match(/[/\s]/g)) {
      return this.setState({ error: 'Name may not contain spaces.' })
    }

    if (name.match(/[.$#[\]/]/g)) {
      return this.setState({
        error: 'Name may contain letters and symbols except for ., $, #, [, ], /.'
      })
    }

    if (this.props.onCreateClick) {
      this.props.onCreateClick(name)
    }
    this.close()
  }

  close = () => {
    this.setState({
      open: false
    })
    if (this.props.onRequestClose) {
      this.props.onRequestClose()
    }
  }

  render () {
    const { open, error } = this.state

    const actions = [
      <FlatButton
        label='Cancel'
        secondary
        onClick={this.close}
      />,
      <FlatButton
        label='Create'
        primary
        onClick={this.handleSubmit}
      />
    ]

    return (
      <Dialog
        title='New Project'
        modal={false}
        actions={actions}
        open={open}
        onRequestClose={this.close}
        contentClassName={classes['container']}>
        <div className={classes['inputs']}>
          <TextField
            hintText='exampleProject'
            floatingLabelText='Project Name'
            ref='projectNameField'
            onChange={(e) => this.handleInputChange('name', e)}
            errorText={error || null}
          />
        </div>
      </Dialog>
    )
  }
}
