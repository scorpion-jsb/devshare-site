import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'redux-grout';

import './App.scss';

import Navbar from '../../components/Navbar/Navbar';

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(loc) {
    this.props.history.pushState(null, `/${loc}`);
  }
  render() {
    return (
      <div className="App">
        <Navbar
          account={ this.props.account }
          onMenuClick={ this.handleClick }
          onLogoutClick={ this.props.logout }
        />
        { this.props.children }
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
