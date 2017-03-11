import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
// import AccountDialog from '../components/AccountDialog/AccountDialog'
import AccountForm from '../components/AccountForm/AccountForm'
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
import classes from './AccountContainer.scss'

const { pathToJS, isLoaded } = helpers
const defaultUserImageUrl = 'https://s3.amazonaws.com/kyper-cdn/img/User.png'

@devshare()
@connect(
  ({devshare}) => ({
    authError: pathToJS(devshare, 'authError'),
    account: pathToJS(devshare, 'profile'),
    initialValues: pathToJS(devshare, 'profile')
  })
)
@reduxForm({
  form: 'Account'
})
export default class Account extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    devshare: PropTypes.shape({
      logout: PropTypes.func.isRequired,
      uploadAvatar: PropTypes.func,
      updateAccount: PropTypes.func
    })
  }

  state = { modalOpen: false }

  handleLogout = () =>
    this.props.devshare
      .logout()
      .then(() => this.context.router.push('/'))

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  render () {
    const { account, devshare: { saveAccount } } = this.props

    if (!isLoaded(account)) {
      return (
        <div className={classes.container}>
          <CircularProgress size={80} />
        </div>
      )
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.pane}>
          <div className={classes.settings}>
            <section className={classes.avatar}>
              <img
                className={classes['avatar-current']}
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
