import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import TextField from '../../../../components/TextField'
import classes from './AccountForm.scss'
import ProviderDataForm from '../ProviderDataForm/ProviderDataForm'

export const AccountForm = ({ account, handleSubmit, submitting }) => (
  <div className={classes.container}>
    <h4>Account</h4>
    <div>
      <Field
        name='username'
        label='Username'
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
    <div>
      <h4>Linked Accounts</h4>
      {
        account.providerData &&
          <ProviderDataForm
            providerData={account.providerData}
          />
      }
    </div>
  </div>
)

AccountForm.propTypes = {
  account: PropTypes.shape({
    providerData: PropTypes.array
  }),
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default AccountForm
