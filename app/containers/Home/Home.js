import React, { Component } from 'react';
import map from 'lodash/collection/map';
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
import GroupIcon from 'material-ui/lib/svg-icons/social/group';

class Home extends Component {
  render() {
    const meInThree = [
      {
        title: 'Work with others in real-time',
        icon: <GroupIcon />,
        desc: 'Share a public link, share with editing access or share read-only'
      },
      {
        title: 'Work with others in real-time',
        icon: <GroupIcon />,
        desc: 'Share a public link, share with editing access or share read-only'
      },
      {
        title: 'Work with others in real-time',
        icon: <GroupIcon />,
        desc: 'Share a public link, share with editing access or share read-only'
      }
    ];

    const meInThreeElements = map(meInThree, (content) => {
      return (
        <div className="Home-MeInThree-Item">
          <div className="Home-MeInThree-Title">
            { content.title }
          </div>
          { content.icon }
          <div className="Home-MeInThree-Desc">
            { content.desc }
          </div>
        </div>
      );
    });

    const buttonStyle = {margin: '1rem'};
    return (
      <div className="Home">
        <div className="Home-Hero">
          <span className="Home-Name">Build together</span>
          <span className="Home-Description">
            real-time, full-project code editing in browser
          </span>
          <RaisedButton
            style={ buttonStyle }
            label="Share Code"
            containerElement={ <Link to={ `/anon/${randomProjectId()}` } /> }
            />
        </div>
        <div className="Home-MeInThree">
          { meInThreeElements }
        </div>
        <div className="Home-Footer">
          Made by <a target="_blank" href="http://kyper.io">Kyper</a>
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
