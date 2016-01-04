import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { randomProjectId } from '../../helpers';
import { Actions } from 'redux-grout';
import './Home.scss';
//React Components
import RaisedButton from 'material-ui/lib/raised-button';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <span className="Home-Hero">
          <h1>Hypercube</h1>
          <h3>An open-source web-based collaborataive code editor & project building environment</h3>
        </span>
        <div className="Home-Buttons">
          <RaisedButton label="Try Now"
            containerElement={ <Link to={ `/try/${randomProjectId()}` } /> }
          />
          <RaisedButton label="View code on GitHub"
            containerElement={ <a href="https://github.com/prescottprue/hypercube"></a> }
          />
        </div>
      </div>
    )
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    account: state.account,
    router: state.router,
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.projects, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
