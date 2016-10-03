import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import LoginForm from '../components/LoginForm/LoginForm'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import GithubIcon from 'react-icons/lib/go/mark-github'

// styles
import classes from './LoginContainer.scss'

// redux-devsharev3
import { connect } from 'react-redux'
import { devshare, helpers } from 'redux-devshare'
const { isLoaded, isEmpty, pathToJS } = helpers

// Props decorators
@devshare()
@connect(
  ({devshare}) => ({
    authError: pathToJS(devshare, 'authError'),
    account: pathToJS(devshare, 'profile')
  })
)
export default class Login extends Component {
  static propTypes = {
    account: PropTypes.object,
    devshare: PropTypes.object,
    authError: PropTypes.object,
    location: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object
  }

  state = {
    snackCanOpen: false
  }

  handleLogin = loginData => {
    this.setState({ snackCanOpen: true })
    this.props.devshare
      .login(loginData)
      .then(account => this.context.router.push(`/${account.username}`))
  }

  providerLogin = (provider) =>
    this.handleLogin({ provider, type: 'popup' })

  render () {
    const { isLoading, snackCanOpen } = this.state
    const { authError } = this.props

    if (isLoading && !authError) {
      return (
        <div className={classes['container']}>
          <div className={classes['progress']}>
            <CircularProgress mode='indeterminate' />
          </div>
        </div>
      )
    }

    return (
      <div className={classes['container']}>
        <Paper className={classes['panel']}>
          <LoginForm onSubmit={this.handleLogin} />
        </Paper>
        <div className={classes['or']}>
          or
        </div>
        <div className={classes['providers']}>
          <GoogleButton onClick={() => this.providerLogin('google')} />
        </div>
        <div className={classes['providers']}>
          <RaisedButton
            className={classes['github']}
            onClick={() => this.providerLogin('github')}
            label='Sign in with Github'
            icon={
              <FontIcon className={classes['github-icon']}>
                <GithubIcon />
              </FontIcon>
            }
          />
        </div>
        <div className={classes['signup']}>
          <span className={classes['signup-label']}>
            Need an account?
          </span>
          <Link className={classes['signup-link']} to='/signup'>
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
