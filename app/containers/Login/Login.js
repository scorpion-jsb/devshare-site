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
  }
  handleLogin() {

  }
  render() {
    return (
      <div className="Login">

        <form className="Login-Form" onSubmit={this.handleLogin}>
            <TextField
            hintText="me@example.com"
            floatingLabelText="Email/Username" />
            <TextField
              hintText="password"
              floatingLabelText="Password" />
            <div className="Submit-Login-Form">
              <RaisedButton label="Login" primary={true} />
            </div>
        </form>

        <div className="Login-GoTo-Signup">
          <span className="Login-GoTo-Signup-Label">
            Need an account?
          </span>
          <Link className="Login-GoTo-Signup-Link" to="/signup">Sign Up</Link>
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
