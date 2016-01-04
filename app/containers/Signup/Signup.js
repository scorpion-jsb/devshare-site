import { capitalize, find } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';

import './Signup.scss';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
    this.goAfterLoggedIn = this.goAfterLoggedIn.bind(this);
    this.requireInputs = this.requireInputs.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {errors:{}};
  }
  reset() {
    return this.setState({
      errors:{},
      username: null,
      email: null,
      name: null
    });
  }
  /**
   * @function handleSignup
   * @description Fire onLoginClick function provided to component when login is clicked
   */
  handleSignup(e) {
    e.preventDefault();
    let newAccountData = this.state;
    if(this.requireInputs()){
      newAccountData.password = this.password;
      newAccountData.confirm = this.confirm;
      this.props.signup(newAccountData);
      this.goAfterLoggedIn('/projects');
    }
  }
  /**
   * @function requireInputs
   * @description Confirm that all required inputs have values
   * @return {Boolean}
   */
  requireInputs() {
    const requiredInputs = [
      {name: 'username', val: this.state.username},
      {name: 'email', val: this.state.email},
      {name: 'name', val: this.state.name},
      {name: 'password', val: this.password},
      {name: 'confirm', val: this.confirm},
    ];
    const firstError = find(requiredInputs, (input) => {
      if(!input.val || input.val == ''){
        return true;
      }
    });
    if(firstError){
      let errors = {};
      errors[firstError.name] = `${capitalize(firstError.name)} is required`;
      this.setState({errors});
      return false;
    }
    return true;
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
    if(!this.props.account.isFetching){
      return (
        <div className="Signup">
          <form className="Signup-Form" onSubmit={ this.handleSignup }>
            <TextField
              hintText="username"
              floatingLabelText="Username"
              onChange={this.handleInputChange.bind(this, 'username')}
              errorText={ this.state.errors.username }
            />
            <TextField
              hintText="email"
              floatingLabelText="Email"
              onChange={this.handleInputChange.bind(this, 'email')}
              errorText={ this.state.errors.email }
            />
            <TextField
              hintText="name"
              floatingLabelText="Name"
              onChange={this.handleInputChange.bind(this, 'name')}
              errorText={ this.state.errors.name }
            />
            <TextField
              hintText="password"
              floatingLabelText="Password"
              onChange={this.handlePrivateChange.bind(this, 'password')}
              errorText={ this.state.errors.password }
            />
            <TextField
              hintText="confirm"
              floatingLabelText="Confirm Password"
              onChange={this.handlePrivateChange.bind(this, 'confirm')}
              errorText={ this.state.errors.confirm }
            />
            <div className="Submit-Signup-Form">
              <RaisedButton
                label="Sign Up"
                primary={true}
                type="submit"
                disabled={ this.props.account && this.props.account.isFetching}
              />
            </div>
            <RaisedButton label="Cancel" type="reset" onClick={ this.reset }/>
          </form>
          <div className="Signup-Login">
            <span className="Signup-Login-Label">
              Already have an account?
            </span>
            <Link className="Signup-Login-Link" to="/login">Login</Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="Signup">
          <div className="Signup-Progress">
            <CircularProgress  mode="indeterminate" />
          </div>
        </div>
      );
    }
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.account, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
