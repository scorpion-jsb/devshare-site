import React, { Component } from 'react';
import { Link } from 'react-router';
import './Home.scss';
//React Components
import RaisedButton from 'material-ui/lib/raised-button';

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <h2>Hypercube</h2>
        <p>a web-based collaborataive code editor & project building environment</p>
        <h3>Hypercube is built using the following frameworks & libraries:</h3>
        <ul>
          <li>React - View Rendering</li>
          <li>Redux - State management</li>
          <li>Matter - Authentication through Tessellate</li>
          <li>Grout - Application building/management communication with Tessellate</li>
        </ul>

        <a href="https://github.com/prescottprue/hypercube">
          <RaisedButton label="View code on GitHub" />
        </a>
      </div>
    )
  }
}
