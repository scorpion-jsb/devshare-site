import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

  class HelloWorld extends Component {
      render() {
          return (<div>Hello world</div>);
      }
  }
  let rootElement = document.getElementById('content');
  ReactDOM.render(<HelloWorld />, rootElement);
