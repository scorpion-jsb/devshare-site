import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';
import './Login.scss';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';
import LoginForm from '../../components/LoginForm/LoginForm';

 class Login extends Component {
   constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.goAfterLoggedIn = this.goAfterLoggedIn.bind(this);
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
  handleLogin(loginData) {
    this.props.login(loginData);
    this.goAfterLoggedIn('/projects');
  }
  render() {
    if(!this.props.account.isFetching){
      return (
        <div className="Login">
          <Paper className="Login-Panel">
            <LoginForm onLogin={ this.handleLogin } />
          </Paper>
          <div className="Login-Signup">
            <span className="Login-Signup-Label">
              Need an account?
            </span>
            <Link className="Login-Signup-Link" to="/signup">
              Sign Up
            </Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="Login">
          <div className="Login-Progress">
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
