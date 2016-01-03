import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

import './Signup.scss';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
    this.goAfterLoggedIn = this.goAfterLoggedIn.bind(this);
    this.state = {errors:{username: null, email: null, name:null, password:null}};
  }
  /**
   * @function handleSignup
   * @description Fire onLoginClick function provided to component when login is clicked
   */
  handleSignup(event) {
    event.preventDefault();
    let newAccountData = this.getState();
    newAccountData.password = this.password ? this.password : '';
    this.props.signup(newAccountData);
    this.goAfterLoggedIn('/projects');
  }
  /**
   * @function handleInputChange
   * @description Update the state with the values from the form inputs.
   * @fires context#setState
   */
  handleInputChange(name, e) {
    e.preventDefault();
    this.setState({
      [name]: e.target.value
    });
  }
  /**
   * @function handlePrivateChange
   * @description Store private values.
   * @fires context#setState
   */
  handlePrivateChange(name, e) {
    e.preventDefault();
    this[name] = e.target.value;
  }
  //TODO: Replace this with redux-rx
  goAfterLoggedIn(newState) {
    setTimeout(() => {
      if(this.props.account && this.props.account.username){
        this.props.history.pushState(null, newState);
      } else {
        this.goAfterLoggedIn(newState);
      }
    }, 500);
  }
  render() {
    return (
      <div className="Signup">
        <form className="Signup-Form" onSubmit={ this.handleSignup }>
          <TextField
            hintText="username"
            floatingLabelText="Username"
            onChange={this.handleInputChange.bind(this, 'username')}
          />
          <TextField
            hintText="email"
            floatingLabelText="Email"
            onChange={this.handleInputChange.bind(this, 'email')}
          />
          <TextField
            hintText="name"
            floatingLabelText="Name"
            onChange={this.handleInputChange.bind(this, 'name')}
          />
          <TextField
            hintText="password"
            floatingLabelText="Password"
            onChange={this.handlePrivateChange.bind(this, 'password')}
            required
          />
          <TextField
            hintText="password"
            floatingLabelText="Confirm Password"
            onChange={this.handlePrivateChange.bind(this, 'confirm')}
          />
          <div className="Submit-Signup-Form">
            <RaisedButton label="Sign Up" primary={true} type="submit"/>
          </div>
          <RaisedButton label="Cancel" type="reset"/>
        </form>
        <div className="Signup-GoTo-Login">
          <span className="Signup-GoTo-Login-Label">
            Already have an account?
          </span>
          <Link className="Signup-GoTo-Login-Link" to="/login">Login</Link>
        </div>

      </div>
    )
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.account, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
