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
import Snackbar from 'material-ui/lib/snackbar';

import './Signup.scss';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
    this.goAfterLoggedIn = this.goAfterLoggedIn.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {errors:{}, snackCanOpen: true};
  }
  handleRequestClose = () => {
    this.setState({
     snackOpen: false,
    });
  };
  reset() {
    return this.setState({
      errors:{},
      username: null,
      email: null,
      name: null,
      snackOpen: false
    });
  }
  /**
   * @function handleSignup
   * @description Fire onLoginClick function provided to component when login is clicked
   */
  handleSignup(signupData) {
    this.setState({
      snackCanOpen: true
    });
    this.props.signup(signupData);
    this.goAfterLoggedIn();
  }
  //TODO: Replace this with redux-rx
  goAfterLoggedIn() {
    setTimeout(() => {
      if(this.props.account && this.props.account.username){
        this.props.history.pushState(null, `/${this.props.account.username}`);
      } else {
        this.goAfterLoggedIn();
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
          <Snackbar
            open={ typeof this.props.account.error !== 'undefined' && this.props.account.error !== null && this.state.snackCanOpen }
            message={ this.props.account.error || '' }
            action="close"
            autoHideDuration={ 3000 }
            onRequestClose={ this.handleRequestClose }
          />
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
