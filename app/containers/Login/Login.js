import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';
import './Login.scss';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

 class Login extends Component {
   constructor(props) {
     super(props);
     this.handleLogin = this.handleLogin.bind(this);
     this.goAfterLoggedIn = this.goAfterLoggedIn.bind(this);
     this.handleInputChange = this.handleInputChange.bind(this);
     this.handlePrivateChange = this.handlePrivateChange.bind(this);
     this.state = {errors:{username:null, password:null}};
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
   * @description Store data in object instead of state
   */
  handlePrivateChange(name, e) {
    e.preventDefault();
    this[name] = e.target.value;
  }
  handleLogin(e) {
    if(e && typeof e.preventDefault === 'function'){
      e.preventDefault();
    }
    let error;
    if(!this.state.username || this.state.username == ''){
      error.username = 'Username required';
      return;
    }
    if(!this.password || this.password == ''){
      error.password = 'Password required';
      return;
    }
    if(error){
      this.setState({
        error
      });
      return;
    }
    let loginData = {username:this.state.username, password: this.password};
    this.props.login(loginData);
    this.goAfterLoggedIn('/projects');
   }
  render() {
    return (
      <div className="Login">
        <form className="Login-Form" onSubmit={ this.handleLogin }>
          <TextField
            hintText="some@email.com"
            floatingLabelText="Username/Email"
            onChange={this.handleInputChange.bind(this, 'username')}
            errorText={ this.state.errors.username }
            required
          />
          <TextField
            hintText="password"
            floatingLabelText="Password"
            type="password"
            onChange={this.handlePrivateChange.bind(this, 'password')}
            errorText={ this.state.errors.password }
            required
          />
          <div className="Submit-Login-Form">
            <RaisedButton
              label="Login"
              primary={true}
              type="submit"
              disabled={ this.props.account && this.props.account.isFetching}
            />
          </div>
        </form>
        <div className="Login-GoTo-Signup">
          <span className="Login-GoTo-Signup-Label">
            Need an account?
          </span>
          <Link className="Login-GoTo-Signup-Link" to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
