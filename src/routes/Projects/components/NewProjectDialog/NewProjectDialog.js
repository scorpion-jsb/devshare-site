import React, { PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import { SelectField, TextField } from 'redux-form-material-ui'
import { map } from 'lodash'
import Dialog from 'material-ui/Dialog'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import { required } from 'utils/form'
import { formNames } from 'constants'
import classes from './NewProjectDialog.scss'

export const NewProjectDialog = ({
  open,
  templates,
  submit,
  handleSubmit,
  submitting,
  invalid,
  onRequestClose
}) => (
  <Dialog
    title='New Project'
    modal={false}
    actions={[
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={onRequestClose}
      />,
      <FlatButton
        label='Create'
        primary
        keyboardFocused
        disabled={submitting || invalid}
        onTouchTap={submit}
      />
    ]}
    open={open}
    onRequestClose={onRequestClose}
    contentClassName={classes.container}
  >
    <form className={classes.inputs} onSubmit={handleSubmit}>
      <Field
        name='name'
        hintText='exampleProject'
        floatingLabelText='Project Name'
        component={TextField}
        validate={[required]}
      />
      <Field
        name='template'
        floatingLabelText='Template'
        component={SelectField}
      >
        {
          map(templates, (t, key) =>
            <MenuItem
              key={key}
              primaryText={t.name}
              value={key}
            />
          )
        }
      </Field>
    </form>
  </Dialog>
)

NewProjectDialog.propTypes = {
  open: PropTypes.bool,
  templates: PropTypes.object,
  submit: PropTypes.func.isRequired, // added by redux-form
  handleSubmit: PropTypes.func.isRequired, // added by redux-form
  submitting: PropTypes.bool.isRequired, // added by redux-form
  invalid: PropTypes.bool.isRequired, // added by redux-form
  onRequestClose: PropTypes.func.isRequired
}

export default reduxForm({
  form: formNames.newProject
})(NewProjectDialog)
