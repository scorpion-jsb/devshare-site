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
  }
  render() {
    return (
      <div className="Signup">

        <form className="Signup-Form">
            <TextField
            hintText="username"
            floatingLabelText="Username" />
            <TextField
              hintText="email"
              floatingLabelText="Email" />
            <TextField
              hintText="name"
              floatingLabelText="Name" />
            <TextField
              hintText="password"
              floatingLabelText="Password" />
            <TextField
              hintText="confirm password"
              floatingLabelText="Confirm Password" />
            <div className="Submit-Signup-Form">
              <RaisedButton label="Sign Up" primary={true} />
            </div>
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
