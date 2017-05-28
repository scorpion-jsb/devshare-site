import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS } from 'react-redux-firebase'
import { paths } from 'constants'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar'
import stockPhotoUrl from 'static/User.png'
import classes from './Navbar.scss'

const originSettings = { horizontal: 'right', vertical: 'top' }
const buttonStyle = { color: 'white', textDecoration: 'none' }
const avatarSize = 62

const avatarStyles = {
  icon: { width: '100%', height: '100%' },
  button: { marginRight: '.25rem', width: avatarSize, height: avatarSize },
  wrapper: { marginTop: '0px' }
}

@firebaseConnect()
@connect(
  ({firebase}) => ({
    account: pathToJS(firebase, 'profile')
  })
)
export default class Navbar extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object,
    firebase: PropTypes.object.isRequired
  }

  handleLogout = () =>
    this.props.firebase
      .logout()
      .then(() => this.context.router.push('/'))

  render () {
    const { account } = this.props

    const iconButton = (
      <IconButton iconStyle={avatarStyles.icon} style={avatarStyles.button}>
        <Avatar
          src={account && account.avatarUrl ? account.avatarUrl : stockPhotoUrl}
        />
      </IconButton>
    )

    const mainMenu = (
      <div className={classes.menu}>
        <Link to={paths.signup}>
          <FlatButton
            label='Sign Up'
            style={buttonStyle}
          />
        </Link>
        <Link to={paths.login}>
          <FlatButton
            label='Login'
            style={buttonStyle}
          />
        </Link>
      </div>
    )

    const rightMenu = account && account.email ? (
      <IconMenu
        iconButtonElement={iconButton}
        targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorOrigin={originSettings}
        animated={false}
      >
        <Link to={paths.account}>
          <MenuItem
            primaryText='Account'
          />
        </Link>
        <MenuItem
          primaryText='Sign out'
          onClick={this.handleLogout}
        />
      </IconMenu>
    ) : mainMenu

    // Only apply styling if avatar is showing
    const menuStyle = account && account.username && avatarStyles.wrapper

    // Redirect to users home page if logged in
    const brandPath = account && account.username ? `/${account.username}` : '/'

    return (
      <AppBar
        title={
          <Link to={brandPath} className={classes.brand}>
            devshare
          </Link>
        }
        showMenuIconButton={false}
        iconElementRight={rightMenu}
        iconStyleRight={menuStyle}
      />
    )
  }
}
