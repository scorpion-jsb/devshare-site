import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import FlatButton from 'material-ui/FlatButton'
import classes from './DeleteDialog.scss'
import { formNames } from 'constants'

export const DeleteDialog = ({
  open,
  submit,
  reset,
  name,
  handleSubmit,
  submitting,
  invalid,
  onRequestClose
}) => {
  const isProjectName = value =>
    value && value === name
      ? undefined
      : 'Name Does Not Match'
  return (
    <Dialog
      title='Delete Project'
      modal={false}
      actions={[
        <FlatButton
          label='Cancel'
          secondary
          onTouchTap={() => {
            reset()
            onRequestClose()
          }}
        />,
        <FlatButton
          label='Delete'
          primary
          disabled={submitting || invalid}
          onTouchTap={submit}
        />
      ]}
      open={open}
      onRequestClose={onRequestClose}
      contentClassName={classes.container}
    >
      <form className={classes.inputs} onSubmit={handleSubmit}>
        <div className={classes.content}>
          <div className={classes.section}>
            <h3 className={classes.warning}>WARNING: </h3>
            <span>This is a permenant action</span>
          </div>
          <div className={classes.question}>
            <span>Are you sure this is what you want to be doing?</span>
          </div>
          <div className={classes.restatement}>
            <span>
              You are about to delete your project named
              <span className={classes.restatementName}>
                {name}
              </span>
            </span>
          </div>
          <div className={classes.inputGroup}>
            <span>Please type in the name of the project to confirm:</span>
            <Field
              floatingLabelText='Project Name'
              name='name'
              validate={[required, isProjectName]}
              component={TextField}
            />
          </div>
        </div>
      </form>
    </Dialog>
  )
}

DeleteDialog.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool,
  submit: PropTypes.func.isRequired, // added by redux-form
  reset: PropTypes.func.isRequired, // added by redux-form
  handleSubmit: PropTypes.func.isRequired, // added by redux-form
  submitting: PropTypes.bool.isRequired, // added by redux-form
  invalid: PropTypes.bool.isRequired, // added by redux-form
  onRequestClose: PropTypes.func.isRequired
}

export default reduxForm({
  form: formNames.removeProject
})(DeleteDialog)
