import { capitalize, find } from 'lodash'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Actions } from 'redux-grout'
import Paper from 'material-ui/lib/paper'
import RaisedButton from 'material-ui/lib/raised-button'
import CircularProgress from 'material-ui/lib/circular-progress'
import SignupForm from '../../components/SignupForm/SignupForm'
import GoogleButton from '../../components/GoogleButton/GoogleButton'
import Snackbar from 'material-ui/lib/snackbar'
import './Signup.scss'

class Signup extends Component {
  constructor(props) {
    super(props)
  }

  state = { errors:{ username:null, password:null }, snackCanOpen: false }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  handleRequestClose = () => {
    this.setState({
     snackCanOpen: false,
    })
  };

  reset = () => {
    return this.setState({
      errors:{},
      username: null,
      email: null,
      name: null,
      snackCanOpen: false
    })
  };

  /**
   * @function handleSignup
   * @description Call signup through redux-grout action
   */
  handleSignup = (signupData) => {
    this.setState({
      snackCanOpen: true
    })
    this.props.signup(signupData)
    window.ga.event({category: 'User', action: 'Email Signup' })
    this.goAfterLoggedIn()
  };

  /**
   * @function providerSignup
   * @description Initiate external providerSignup through redux-grout action (popup)
   */
  providerSignup = (provider) => {
    this.setState({
      snackCanOpen: true
    })
    this.props.signup(provider)
    window.ga.event({category: 'User', action: 'Provider Signup', value: provider })
    this.goAfterLoggedIn()
  };

  //TODO: Replace this with redux-rx
  goAfterLoggedIn() {
    setTimeout(() => {
      if(this.props.account && this.props.account.username){
        this.context.router.push(`/${this.props.account.username}`)
      } else {
        this.goAfterLoggedIn()
      }
    }, 300)
  };

  render() {
    if(!this.props.account.isFetching){
      return (
        <div className="Signup">
          <Paper className="Signup-Panel">
            <SignupForm onSignup={ this.handleSignup } />
          </Paper>
          <div className="Signup-Or">
            or
          </div>
          <GoogleButton onClick={ this.providerSignup.bind(this, 'google') } />
          <RaisedButton
            label="Sign in with GitHub"
            secondary={ true }
            onTouchTap={ this.providerSignup.bind(this, 'github') }
          />
          <div className="Signup-Login">
            <span className="Signup-Login-Label">
              Already have an account?
            </span>
            <Link className="Signup-Login-Link" to="/login">Login</Link>
          </div>
          <Snackbar
            open={ typeof this.props.account.error !== 'undefined' && this.props.account.error !== null && this.state.snackCanOpen }
            message={ this.props.account.error || 'Signup error' }
            action="close"
            autoHideDuration={ 3000 }
            onRequestClose={ this.handleRequestClose }
          />
        </div>
      )
    } else {
      return (
        <div className="Signup">
          <div className="Signup-Progress">
            <CircularProgress  mode="indeterminate" />
          </div>
        </div>
      )
    }
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    account: state.account,
    router: state.router
  }
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.account, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup)
