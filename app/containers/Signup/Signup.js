import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Actions } from 'redux-devshare'
import { event } from '../../helpers/ga'

// Components
import SignupForm from '../../components/SignupForm/SignupForm'
import GoogleButton from '../../components/GoogleButton/GoogleButton'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'

import './Signup.scss'

class Signup extends Component {

  static propTypes = {
    account: PropTypes.object,
    signup: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  state = {
    errors: { username: null, password: null },
    snackCanOpen: false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.account.username) {
      this.context.router.push(`/${nextProps.account.username}`)
    }
  }

  handleSnackClose = () => {
    this.setState({
      snackCanOpen: false
    })
  }

  /**
   * @function reset
   * @description Reset whole state (inputs, errors, snackbar open/close)
   */
  reset = () =>
    this.setState({
      errors: {},
      username: null,
      email: null,
      name: null,
      snackCanOpen: false
    })

  /**
   * @function handleSignup
   * @description Call signup through redux-devshare action
   */
  handleSignup = signupData => {
    this.setState({ snackCanOpen: true })
    this.props.signup(signupData)
    event({ category: 'User', action: 'Email Signup' })
  }

  /**
   * @function providerSignup
   * @description Initiate external providerSignup through redux-devshare action (popup)
   */
  providerSignup = provider => {
    this.setState({ snackCanOpen: true })
    this.props.signup(provider)
    event({ category: 'User', action: 'Provider Signup', value: provider })
  }

  render () {
    if (!this.props.account.isFetching) {
      return (
        <div className='Signup'>
          <Paper className='Signup-Panel'>
            <SignupForm onSignup={this.handleSignup} />
          </Paper>
          <div className='Signup-Or'>
            or
          </div>
          <GoogleButton onClick={this.providerSignup.bind(this, 'google')} />
          <RaisedButton
            label='Sign in with GitHub'
            primary
            onTouchTap={this.providerSignup.bind(this, 'github')}
          />
          <div className='Signup-Login'>
            <span className='Signup-Login-Label'>
              Already have an account?
            </span>
            <Link className='Signup-Login-Link' to='/login'>Login</Link>
          </div>
          <Snackbar
            open={this.props.account.error !== null && this.state.snackCanOpen}
            message={this.props.account.error || 'Signup error'}
            action='close'
            autoHideDuration={3000}
            onRequestClose={this.handleSnackClose}
          />
        </div>
      )
    }
    return (
      <div className='Signup'>
        <div className='Signup-Progress'>
          <CircularProgress mode='indeterminate' />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
