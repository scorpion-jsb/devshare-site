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
import EditIcon from 'material-ui/lib/svg-icons/action/view-quilt';
import StartIcon from 'material-ui/lib/svg-icons/content/create';

class Home extends Component {
  render() {
    const iconStyle = {
      width: '130px',
      height: '130px'
    };
    const meInThree = [
      {
        title: 'Work with others in real-time',
        icon: <GroupIcon style={iconStyle} />,
        desc: 'Share a public link, share with editing access or share read-only becuase you hold the keys to your creations.'
      },
      {
        title: 'Customize build environments',
        icon: <EditIcon style={iconStyle} />,
        desc: 'Use a combination of community-built components, templates and tabs to cater your flow to your needs.'
      },
      {
        title: 'Start from anywhere',
        icon: <StartIcon style={iconStyle} />,
      desc: 'Upload or clone an existing project, start from scratch or use a templates to get you started.'
      }
    ];

    const meInThreeElements = map(meInThree, (content, key) => {
      return (
        <div className="Home-MeInThree-Item" key={ key } >
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
        <div className="Home-Hero" style={{ color: Theme.palette.accent3Color }}>
          <video className="Home-PreviewVideo" autoPlay loop> //EDIT: loop="true" and  autoplay="autoplay" are deprecated
            <source src="assets/devShareEdit.mp4" type="video/mp4" />
            <source src="assets/devShareEdit.ogv" type="video/ogg" />
            Your browser does not support the video tag.
          </video>
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
