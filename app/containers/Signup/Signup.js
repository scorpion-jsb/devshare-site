import { capitalize, find } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';
import SignupForm from '../../components/SignupForm/SignupForm';
import './Signup.scss';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
    this.goAfterLoggedIn = this.goAfterLoggedIn.bind(this);
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
  handleSignup(signupData) {
    this.props.signup(signupData);
    this.goAfterLoggedIn('/projects');
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
          <Paper className="Signup-Panel">
            <SignupForm onSignup={ this.handleSignup } />
          </Paper>
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
