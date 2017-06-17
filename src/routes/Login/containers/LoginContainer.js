import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Raven from 'raven-js'
import GoogleButton from 'react-google-button'
import { firebaseConnect, pathToJS, isLoaded, isEmpty } from 'react-redux-firebase'
import Paper from 'material-ui/Paper'
import Snackbar from 'material-ui/Snackbar'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import GithubIcon from 'react-icons/lib/go/mark-github'
import { UserIsNotAuthenticated } from 'utils/router'
import { paths } from 'constants'
import { trackEvent } from 'utils/analytics'
import LoadingSpinner from 'components/LoadingSpinner'
import LoginForm from '../components/LoginForm'
import classes from './LoginContainer.scss'

@UserIsNotAuthenticated // redirect to home if logged in
@firebaseConnect()
@connect(
  ({firebase}) => ({
    authError: pathToJS(firebase, 'authError'),
    account: pathToJS(firebase, 'profile')
  })
)
export default class Login extends Component {
  static propTypes = {
    firebase: PropTypes.shape({
      login: PropTypes.func.isRequired
    }),
    account: PropTypes.object,
    authError: PropTypes.object
  }

  state = {
    snackCanOpen: false
  }

  handleLogin = loginData => {
    this.setState({ snackCanOpen: true })
    return this.props.firebase.login(loginData)
      .then((account) => trackEvent({ category: 'Auth', action: 'Login' }))
      .catch((err) => {
        Raven.captureException('Error with Login:', err)
        return Promise.reject(err)
      })
  }

  providerLogin = (provider) =>
    this.handleLogin({ provider, type: 'popup' })

  render () {
    const { snackCanOpen } = this.state
    const { authError, account } = this.props

    if (!isLoaded(account)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.panel}>
          <LoginForm onSubmit={this.handleLogin} />
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
        <div className={classes.signup}>
          <span className={classes.signupLabel}>
            Need an account?
          </span>
          <Link className={classes.signupLink} to={paths.signup}>
            Sign Up
          </Link>
        </div>
        {
          isLoaded(authError) && !isEmpty(authError) && snackCanOpen
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
