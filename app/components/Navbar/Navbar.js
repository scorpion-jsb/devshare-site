import React, { Component, PropTypes } from 'react';
import './Navbar.scss';
import { Actions } from 'redux-grout';
import { Link } from 'react-router';
//Components
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.selectItem = this.selectItem.bind(this);
  }
  static propTypes = {
    account: PropTypes.object,
    onMenuClick: PropTypes.func,
    onLogoutClick: PropTypes.func
  };
  selectItem(e, item) {
    if(item === 'logout' && this.props.onLogoutClick){
      return this.props.onLogoutClick();
    }
    if(this.props.onMenuClick) {
      this.props.onMenuClick(item);
    }
  }
  render() {
    let brandLinkLoc = (this.props.account && this.props.account.username) ? '/projects' : '/';
    let iconButton = (<IconButton><MoreVertIcon /></IconButton>);
    let mainMenu = (
      <div className="Navbar-Main-Menu">
        <FlatButton label="Signup" onClick={ this.selectItem.bind(this, null, 'signup')} />
        <FlatButton label="Login" onClick={ this.selectItem.bind(this, null, 'login')} />
      </div>
    );
    let rightMenu = this.props.account.username ? (
      <IconMenu
        iconButtonElement={ iconButton }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        onChange={ this.selectItem }
      >
        <MenuItem primaryText="Account" value="account" />
        <MenuItem primaryText="Help" value="help"/>
        <MenuItem primaryText="Sign out" value="logout"/>
      </IconMenu>
    ) : mainMenu;
    return (
      <AppBar
        title={<Link to={ brandLinkLoc }>Hypercube</Link>}
        showMenuIconButton={ false }
        iconElementRight={rightMenu}
      />
    )
  }
}
