import React, {Component, PropTypes} from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import classes from './SettingsDialog.scss'

export default class SettingsDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    project: PropTypes.object,
    onRequestClose: PropTypes.func.isRequired
  }

  render () {
    const { project, onRequestClose } = this.props

    const actions = [
      <FlatButton
        label='Close'
        secondary
        onClick={onRequestClose}
        onTouchTap={onRequestClose}
      />
    ]

    const owner = (project && project.owner && project.owner.username)
      ? project.owner.username
      : project.owner

    return (
      <Dialog
        {...this.props}
        title='Settings'
        actions={actions}
        modal={false}
        bodyClassName={classes['body']}
        titleClassName={classes['title']}
        contentClassName={classes['container']}>
        <TextField
          hintText='Project name'
          floatingLabelText='Project name'
          defaultValue={project.name}
        />
        <TextField
          hintText='Owner'
          floatingLabelText='Owner'
          defaultValue={owner}
          disabled
        />
        <TextField
          hintText='Site url'
          floatingLabelText='Site url'
          disabled
        />
      </Dialog>
    )
  }
}
