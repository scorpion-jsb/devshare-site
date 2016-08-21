import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Actions } from 'redux-devshare'
import { event } from '../../helpers/ga'

// Components
import LoginForm from '../../components/LoginForm/LoginForm'
import GoogleButton from '../../components/GoogleButton/GoogleButton'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import RaisedButton from 'material-ui/RaisedButton'

import './Login.scss'

class Login extends Component {

  state = {
    snackCanOpen: false,
    errors: { username: null, password: null }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    login: PropTypes.func.isRequired,
    authWithProvider: PropTypes.func.isRequired
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.account.username) {
      this.context.router.push(`/${nextProps.account.username}`)
    }
  }

  handleRequestClose = () =>
    this.setState({
      snackCanOpen: false
    })

  handleLogin = loginData => {
    this.setState({
      snackCanOpen: true
    })
    this.props.login(loginData)
    event({ category: 'User', action: 'Email Login' })
  }

  providerLogin = provider => {
    this.props.authWithProvider(provider)
    event({ category: 'User', action: 'Provider Login', value: provider })
  }

  render () {
    const { isFetching, error } = this.props.account

    if (isFetching) {
      return (
        <div className='Login'>
          <div className='Login-Progress'>
            <CircularProgress mode='indeterminate' />
          </div>
        </div>
      )
    }

    return (
      <div className='Login'>
        <Paper className='Login-Panel'>
          <LoginForm onLogin={this.handleLogin} />
        </Paper>
        <div className='Login-Or'>
          or
        </div>
        <GoogleButton onClick={this.providerLogin.bind(this, 'google')} />
        <RaisedButton
          label='Sign in With GitHub'
          primary
          onTouchTap={this.providerLogin.bind(this, 'github')}
        />
        <div className='Login-Signup'>
          <span className='Login-Signup-Label'>
            Need an account?
          </span>
          <Link className='Login-Signup-Link' to='/signup'>
            Sign Up
          </Link>
        </div>
        <Snackbar
          open={typeof error !== 'undefined' && this.state.snackCanOpen}
          message={error || 'Error'}
          action='close'
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}

// Place state of redux store into props of component
const mapStateToProps = ({ account, router }) => (
  {
    account,
    router
  }
)

// Place action methods into props
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(Actions.account, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)
