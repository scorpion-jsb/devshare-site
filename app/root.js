import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router'
import routes from './routes';
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
      <Provider store={ this.props.store } className="Root">
        <Router history={ browserHistory } routes={ routes } />
      </Provider>
    );
  }
}

export default Root;
