import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import './Navbar.scss';
//React Components
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';

class Navbar extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    account: PropTypes.object,
    onLogoutClick: PropTypes.func
  };
  render() {
    let brandLinkLoc = (this.props.account && this.props.account.username) ? '/account' : '/';
    let brandLink = <Link to={ brandLinkLoc }>Hypercube</Link>
    let iconButton = (<IconButton><MoreVertIcon /></IconButton>);
    return (
      <AppBar
        title="Hypercube"
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={
          <IconMenu
            iconButtonElement={ iconButton }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Help" />
            <MenuItem primaryText="Sign out" />
          </IconMenu>
        }
      />

    )
  }
}
export default Navbar;
