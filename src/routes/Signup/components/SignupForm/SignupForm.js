import React, { PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'components/TextField'
import { required, validateEmail } from 'utils/form'
import { formNames } from 'constants'

import classes from './SignupForm.scss'

export const SignupForm = ({ handleSubmit, submitting }) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    <Field
      name='username'
      component={TextField}
      label='Username'
      validate={[required]}
    />
    <Field
      name='email'
      component={TextField}
      label='Email'
      validate={[required, validateEmail]}
    />
    <Field
      name='password'
      component={TextField}
      label='Password'
      type='password'
      validate={[required]}
    />
    <div className={classes.submit}>
      <RaisedButton
        label='Signup'
        primary
        type='submit'
        disabled={submitting}
        style={{ width: '100%' }}
      />
    </div>
  </form>
)

SignupForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool // added by redux-form
}

export default reduxForm({
  form: formNames.signup
})(SignupForm)
