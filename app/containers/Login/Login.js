import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LoginForm from '../../components/LoginForm/LoginForm';
import { Actions } from 'redux-grout';
import './Login.scss';

 class Login extends Component {
   constructor(props) {
     super(props);
     this.handleLogin = this.handleLogin.bind(this);
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
   handleLogin(loginData) {
     this.props.login(loginData);
     this.goAfterLoggedIn('/projects');
   }
  render() {
    return (
      <div className="Login">
        <h2>Login</h2>
        <LoginForm onLoginClick={ this.props.login }/>
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
