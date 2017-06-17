import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import TextField from 'components/TextField'
import classes from './AccountForm.scss'
import ProviderDataForm from '../ProviderDataForm/ProviderDataForm'

export const AccountForm = ({ account, handleSubmit, submitting }) => (
  <div className={classes.container}>
    <h4>Account</h4>
    <div>
      <Field
        name='username'
        label='Username'
        disabled
        component={TextField}
      />
    </div>
    <div>
      <Field
        name='email'
        label='Email'
        component={TextField}
      />
    </div>
    {
      account.providerData
      ? (
        <div className={classes.accounts}>
          <ProviderDataForm
            providerData={account.providerData}
          />
        </div>
      )
      : null
    }
  </div>
)

AccountForm.propTypes = {
  account: PropTypes.shape({
    providerData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])
  }),
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default AccountForm
