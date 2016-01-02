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

        <a href="https://github.com/prescottprue/hypercube">
          <RaisedButton label="View code on GitHub" />
        </a>
      </div>
    )
  }
}
