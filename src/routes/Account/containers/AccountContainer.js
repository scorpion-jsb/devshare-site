import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { firebaseConnect, pathToJS, isLoaded } from 'react-redux-firebase'
import Paper from 'material-ui/Paper'
import LoadingSpinner from 'components/LoadingSpinner'
import AccountForm from '../components/AccountForm/AccountForm'
import { UserIsAuthenticated } from 'utils/router'
import defaultUserImageUrl from 'static/User.png'
import classes from './AccountContainer.scss'

@UserIsAuthenticated
@firebaseConnect()
@connect(
  ({firebase}) => ({
    authError: pathToJS(firebase, 'authError'),
    account: pathToJS(firebase, 'profile'),
    initialValues: pathToJS(firebase, 'profile')
  })
)
@reduxForm({
  form: 'Account'
})
export default class Account extends Component {
  static propTypes = {
    account: PropTypes.object,
    firebase: PropTypes.shape({
      logout: PropTypes.func.isRequired,
      uploadAvatar: PropTypes.func,
      updateAccount: PropTypes.func
    })
  }

  state = { modalOpen: false }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  render () {
    const { account, firebase: { saveAccount } } = this.props

    if (!isLoaded(account)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.pane}>
          <div className={classes.settings}>
            <section className={classes.avatar}>
              <img
                className={classes.avatarCurrent}
                src={account && account.avatarUrl || defaultUserImageUrl}
                onClick={this.toggleModal}
              />
            </section>
            <section className={classes.form}>
              <AccountForm
                onSubmit={saveAccount}
                account={account}
              />
            </section>
          </div>
        </Paper>
      </div>
    )
  }
}
