import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Actions } from 'redux-grout';

import './Account.scss';
import RaisedButton from 'material-ui/lib/raised-button';

class Account extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="Account">
        <div className="Account-Data">
          <span>Username: { this.props.account.username || 'No Username'}</span>
          <span>Name: { this.props.account.name || 'No Name'}</span>
          <span>Email: { this.props.account.email || 'No Email'}</span>
          <RaisedButton label="Logout" onClick={ this.props.logout }/>
        </div>
      </div>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(Account);
