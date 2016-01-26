import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';
import './Login.scss';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';
import LoginForm from '../../components/LoginForm/LoginForm';
import GoogleButton from '../../components/GoogleButton/GoogleButton';
import Snackbar from 'material-ui/lib/snackbar';

class Login extends Component {
   constructor(props) {
    super(props);
   }
   state = {errors:{username:null, password:null}, snackCanOpen: false};

   handleRequestClose = () => {
    this.setState({
      snackCanOpen: false,
    });
   };

  //TODO: Replace this with redux-rx
  goAfterLoggedIn = () => {
    setTimeout(() => {
      if(this.props.account && this.props.account.username){
        this.props.history.pushState(null, `/${this.props.account.username}`);
      } else {
        this.goAfterLoggedIn();
      }
    }, 100);
  };
  handleLogin = (loginData) => {
    this.setState({
      snackCanOpen: true
    });
    this.props.login(loginData);
    this.goAfterLoggedIn();
  };
  googleLogin = () => {
    this.props.login('google');
  };
  render() {
    if(!this.props.account.isFetching){
      return (
        <div className="Login">
          <Paper className="Login-Panel">
            <LoginForm onLogin={ this.handleLogin } />
          </Paper>
          <div className="Login-Or">
            or
          </div>
          <GoogleButton onClick={ this.googleLogin } />
          <div className="Login-Signup">
            <span className="Login-Signup-Label">
              Need an account?
            </span>
            <Link className="Login-Signup-Link" to="/signup">
              Sign Up
            </Link>
          </div>
          <Snackbar
            open={ typeof this.props.account.error !== 'undefined' && this.props.account.account !== null && this.state.snackCanOpen }
            message={ this.props.account.error || '' }
            action="close"
            autoHideDuration={ 3000 }
            onRequestClose={ this.handleRequestClose }
          />
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
