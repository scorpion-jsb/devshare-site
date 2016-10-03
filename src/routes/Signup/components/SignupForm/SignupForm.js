import React, { PropTypes } from 'react'
import TextField from 'components/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { Field, reduxForm } from 'redux-form'

import classes from './SignupForm.scss'
const buttonStyle = { width: '100%' }

export const validate = ({ email, password, username }) => {
  const errors = {}
  if (!email) errors.email = 'Email Required'
  if (!password) errors.password = 'Password Required'
  if (username) {
    if (username.match(/[/\s]/g)) {
      errors.username = 'Username may not contain spaces'
    }
    if (username.match(/[.$#\[\]\/]/g)) {
      errors.username = 'Username may not contain symbols'
    }
  }
  if (email && email.indexOf('@') === -1) {
    errors.email = 'Invalid Email'
  }
  return errors
}

export const SignupForm = ({ handleSubmit, submitting }) => {
  return (
    <form className={classes['container']} onSubmit={handleSubmit}>
      <div>
        <Field
          component={TextField}
          name='username'
          label='Username'
        />
      </div>
      <div>
        <Field
          component={TextField}
          name='email'
          label='Email'
        />
      </div>
      <div>
        <Field
          component={TextField}
          name='password'
          label='Password'
          type='password'
        />
      </div>
      <div className={classes['submit']}>
        <RaisedButton
          label='Signup'
          primary
          type='submit'
          disabled={submitting}
          style={buttonStyle}
        />
      </div>
    </form>
  )
}

SignupForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: 'Signup',
  validate
})(SignupForm)
