import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import TextField from '../../../../components/TextField'
import classes from './AccountForm.scss'
import ProviderDataForm from '../ProviderDataForm/ProviderDataForm'

export const AccountForm = ({ account, handleSubmit, submitting }) => (
  <div className={classes.container}>
    <Field
      name='username'
      label='Username'
      component={TextField}
    />
    <Field
      name='email'
      label='Email'
      component={TextField}
    />
    <h4 className={classes.title}>Linked Accounts</h4>
    {
      account.providerData &&
        <ProviderDataForm
          providerData={account.providerData}
        />
    }
  </div>
)

AccountForm.propTypes = {
  account: PropTypes.shape({
    providerData: PropTypes.object
  }),
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default AccountForm
