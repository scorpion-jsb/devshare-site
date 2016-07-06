import React, { Component } from 'react'

export default class About extends Component {
  render () {
    return (
      <div className='About'>
        <h3>Devshare is built using the following frameworks & libraries:</h3>
        <ul>
          <li>React - View Rendering</li>
          <li>Redux - State management</li>
          <li>
            <a href='https://github.com/KyperTech/devshare'>Devshare</a> - Platform communication and authentication
          </li>
        </ul>
      </div>
    )
  }
}
