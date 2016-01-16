import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import AppRouter from './app-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
class Root extends Component {
  constructor() {
    super();
  }
  static propTypes = {
    store: PropTypes.object.isRequired
  };
  render() {
    return (
      <Provider store={this.props.store} className="Root">
        <AppRouter />
      </Provider>
    );
  }
}

export default Root;
