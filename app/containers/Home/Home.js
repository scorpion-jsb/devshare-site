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

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme),
    };
  };

  render() {
    const buttonStyle = {margin: '1rem'};
    return (
      <div className="Home">
        <div className="Home-Hero">
          <span className="Home-Name">Hypercube</span>
          <span className="Home-Description">
            An open-source web-based collaborataive code editor & project building environment
          </span>
        </div>
        <div className="Home-Buttons">
          <RaisedButton
            style={ buttonStyle }
            label="Try Now"
            containerElement={ <Link to={ `/try/${randomProjectId()}` } /> }
          />

        </div>
        <div className="Home-Preview">
          <img src="assets/Hypercube-Editor-Example.png" alt="Editor Preview"/>
        </div>
      </div>
    )
  }
}
// <RaisedButton
//   style={ buttonStyle }
//   label="My Projects"
//   containerElement={ <Link to="/login" /> }
// />
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
