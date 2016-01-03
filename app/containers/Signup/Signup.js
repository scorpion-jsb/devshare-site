import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';

import SignupForm from '../../components/SignupForm/SignupForm';

import './Signup.scss';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
    this.goAfterLoggedIn = this.goAfterLoggedIn.bind(this);
  }
  //TODO: Replace this with redux-rx
  goAfterLoggedIn(newState) {
    setTimeout(() => {
      if(this.props.account && this.props.account.username){
        this.props.history.pushState(null, newState);
      } else {
        this.goAfterLoggedIn(newState);
      }
    }, 700);
  }
  handleSignup(signupData) {
    this.props.signup(signupData);
    this.goAfterLoggedIn('/projects');
  }
  render() {
    return (
      <div className="Signup">
        <h2>Signup</h2>
        <SignupForm onLoginClick={ this.props.signup }/>
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
