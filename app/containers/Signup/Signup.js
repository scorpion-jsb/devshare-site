import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-matter';

import SignupForm from '../../components/SignupForm/SignupForm';

import './Signup.scss';

class Signup extends Component {
  constructor(props) {
    super(props);
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
