import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Raven from 'raven-js'
import { firebaseConnect, pathToJS, isLoaded, isEmpty } from 'react-redux-firebase'
import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import GithubIcon from 'react-icons/lib/go/mark-github'
import FontIcon from 'material-ui/FontIcon'
import { trackEvent } from 'utils/analytics'
import { UserIsNotAuthenticated } from 'utils/router'
import { paths } from 'constants'
import LoadingSpinner from 'components/LoadingSpinner'
import SignupForm from '../components/SignupForm'
import classes from './SignupContainer.scss'

@UserIsNotAuthenticated // redirect to home if logged in
@firebaseConnect()
@connect(
  ({firebase}) => ({
    authError: pathToJS(firebase, 'authError'),
    account: pathToJS(firebase, 'profile')
  })
)
export default class Signup extends Component {
  static propTypes = {
    account: PropTypes.object,
    firebase: PropTypes.object,
    authError: PropTypes.object
  }

  state = {
    snackCanOpen: false
  }

  handleRequestClose = () =>
    this.setState({
      snackCanOpen: false
    })

  handleSignup = (creds) => {
    this.setState({ snackCanOpen: true })
    return this.props.firebase
      .createUser(creds, { email: creds.email, username: creds.username })
      .then(() => trackEvent({ category: 'Auth', action: 'Signup' }))
      .catch((err) => {
        Raven.captureException('Error with Email Login:', err)
        return Promise.reject(err)
      })
  }

  providerLogin = (provider) => {
    this.setState({ snackCanOpen: true })
    return this.props.firebase
      .login({ provider, type: 'popup' })
      .catch((err) => {
        Raven.captureException('Erorr with Provider Signup:', err)
        return Promise.reject(err)
      })
  }

  render () {
    const { authError, account } = this.props
    const { snackCanOpen } = this.state

    if (!isLoaded(account)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.panel}>
          <SignupForm onSubmit={this.handleSignup} />
        </Paper>
        <div className={classes.or}>
          or
        </div>
        <div className={classes.providers}>
          <GoogleButton onClick={() => this.providerLogin('google')} />
        </div>
        <div className={classes.providers}>
          <RaisedButton
            className={classes.github}
            onClick={() => this.providerLogin('github')}
            label='Sign in with Github'
            icon={
              <FontIcon className={classes.githubIcon}>
                <GithubIcon />
              </FontIcon>
            }
          />
        </div>
        <div className={classes.login}>
          <span className={classes.loginLabel}>
            Already have an account?
          </span>
          <Link className={classes.loginLink} to={paths.login}>
            Login
          </Link>
        </div>
        {
          authError && authError.message && snackCanOpen
            ? <Snackbar
              open={isLoaded(authError) && !isEmpty(authError) && snackCanOpen}
              message={authError ? authError.message : 'Signup error'}
              action='close'
              autoHideDuration={3000}
              />
            : null
        }
      </div>
    )
  }
}
