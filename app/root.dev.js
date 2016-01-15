import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import AppRouter from './app-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import DevTools from './helpers/DevTools';
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
        <div style={{width: '100%', height: '100%'}}>
          <DevTools />
          <AppRouter />
        </div>
      </Provider>
    );
  }
}

export default Root;
