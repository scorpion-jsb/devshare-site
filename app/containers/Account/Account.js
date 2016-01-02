import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Actions } from 'redux-grout';

import './Account.scss';

class Account extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {

  };
  render(){
    return (
      <div className="Account">

      </div>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(Account);
