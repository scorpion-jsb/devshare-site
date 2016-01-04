import React, { Component } from 'react';
import { Link } from 'react-router';
import './Home.scss';
//React Components
import RaisedButton from 'material-ui/lib/raised-button';

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <span className="Home-Hero">
          <h1>Hypercube</h1>
          <h3>An open-source web-based collaborataive code editor & project building environment</h3>
        </span>
        <RaisedButton label="Try Now"
          containerElement={ <Link to='/try' /> }
        />
        <RaisedButton label="View code on GitHub"
          containerElement={ <a href="https://github.com/prescottprue/hypercube"></a> }
        />
      </div>
    )
  }
}
