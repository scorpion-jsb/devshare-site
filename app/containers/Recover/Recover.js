import React, {Component, PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Actions } from 'redux-grout'
import './Recover.scss'
import Paper from 'material-ui/lib/paper'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'
import CircularProgress from 'material-ui/lib/circular-progress'
import Snackbar from 'material-ui/lib/snackbar'

class Recover extends Component {
  constructor (props) {
    super(props)
    this.state = { errors: { username: null }, open: false }
  }
  /**
   * @function handleInputChange
   * @description Update the state with the values from the form inputs.
   * @fires context#setState
   */
  handleInputChange = (name, e) =>{
    e.preventDefault()
    this.setState({
      [name]: e.target.value,
      errors: { username: null }
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  handleRecover = e => {
    e.preventDefault()
    if (!this.state.username) {
      return this.setState({
        errors: {username: 'Email or Username required'}
      })
    }
    this.props.recover(this.state.username)
    this.setState({
      open: true
    })
  }

  render () {
    const fieldStyle = { width: '80%' }
    const buttonStyle = { width: '80%' }
    if (!this.props.account.isFetching) {
      return (
        <div className="Recover">
          <Paper className="Recover-Panel">
            <TextField
              hintText="some@email.com"
              floatingLabelText="Email or Username"
              errorText={ this.state.errors.username }
              onChange={this.handleInputChange.bind(this, 'username')}
              style={ fieldStyle }
            />
          <div className="Recover-Buttons">
            <RaisedButton
              label="Send"
              primary={true}
              type="submit"
              disabled={ this.props.account && this.props.account.isFetching}
              style={ buttonStyle }
              onClick={ this.handleRecover }
            />
          </div>
          </Paper>
          <div className="Recover-Signup">
            <span className="Recover-Signup-Label">
              Need an account?
            </span>
            <Link className="Recover-Signup-Link" to="/signup">
              Sign Up
            </Link>
          </div>
          <Snackbar
            open={ typeof this.props.account.error !== 'undefined' && this.state.open }
            message={ this.props.account.error || 'Email sent' }
            action="close"
            autoHideDuration={ 3000 }
            onRequestClose={ this.handleRequestClose }
          />
        </div>
      )
    }
    return (
      <div className="Recover">
        <div className="Recover-Progress">
          <CircularProgress  mode="indeterminate" />
        </div>
      </div>
    )
  }
}
// Place state of redux store into props of component
function mapStateToProps (state) {
  return {
    account: state.account,
    router: state.router
  }
}
// Place action methods into props
function mapDispatchToProps (dispatch) {
  return bindActionCreators(Actions.account, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Recover)
