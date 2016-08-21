import React, {Component, PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Actions } from 'redux-devshare'

// Components
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'

import './Recover.scss'

const fieldStyle = { width: '80%' }
const buttonStyle = { width: '80%' }

class Recover extends Component {

  static propTypes = {
    account: PropTypes.object,
    recover: PropTypes.func
  }

  state = { errors: { username: null }, open: false }

  handleInputChange = (name, e) => {
    e.preventDefault()
    this.setState({
      [name]: e.target.value,
      errors: { username: null }
    })
  }

  handleRequestClose = () => {
    this.setState({ open: false })
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
    const { isFetching, error } = this.props.account
    if (isFetching) {
      return (
        <div className='Recover'>
          <div className='Recover-Progress'>
            <CircularProgress mode='indeterminate' />
          </div>
        </div>
      )
    }
    return (
      <div className='Recover'>
        <Paper className='Recover-Panel'>
          <TextField
            hintText='some@email.com'
            floatingLabelText='Email or Username'
            errorText={this.state.errors.username}
            onChange={this.handleInputChange.bind(this, 'username')}
            style={fieldStyle}
          />
          <div className='Recover-Buttons'>
            <RaisedButton
              label='Send'
              primary
              type='submit'
              disabled={this.props.account && isFetching}
              style={buttonStyle}
              onClick={this.handleRecover}
            />
          </div>
        </Paper>
        <div className='Recover-Signup'>
          <span className='Recover-Signup-Label'>
            Need an account?
          </span>
          <Link className='Recover-Signup-Link' to='/signup'>
            Sign Up
          </Link>
        </div>
        <Snackbar
          open={typeof error !== 'undefined' && this.state.open}
          message={this.props.account.error || 'Email sent'}
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

export default connect(mapStateToProps, mapDispatchToProps)(Recover)
