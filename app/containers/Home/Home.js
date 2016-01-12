import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { randomProjectId } from '../../helpers';
import { Actions } from 'redux-grout';
import './Home.scss';
//React Components
import RaisedButton from 'material-ui/lib/raised-button';
import IconButton from 'material-ui/lib/icon-button';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Theme from '../../theme';

class Home extends Component {
  render() {
    const buttonStyle = {margin: '1rem'};
    return (
      <div className="Home">
        <div className="Home-Hero">
          <span className="Home-Name">Devshare</span>
          <span className="Home-Description">
            Shared development from the comfort of your browser
          </span>
        </div>
        <div className="Home-Buttons">
          <RaisedButton
            style={ buttonStyle }
            label="Start Sharing"
            containerElement={ <Link to={ `/try/${randomProjectId()}` } /> }
          />
          <RaisedButton
            style={ buttonStyle }
            label="Sign Up"
            containerElement={ <Link to="/signup" /> }
          />
        </div>
        <div className="Home-Preview">
          <img className="Home-Preview-Img" src="assets/Hypercube-Editor-Example.png" alt="Editor Preview"/>
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
