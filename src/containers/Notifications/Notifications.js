import React, { Component, PropTypes } from 'react'
import { size } from 'lodash'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import actions from 'modules/notification'
import classes from './Notifications.scss'

@connect(({ notification }) => ({ notifications: notification }), actions)
export default class NotificationsContainer extends Component {
  static propTypes = {
    notifications: PropTypes.object.isRequired,
    dismissNotification: PropTypes.func.isRequired
  }

  render () {
    const { notifications, dismissNotification } = this.props
    const closeIconStyle = { paddingTop: '5px', height: '30px' }
    return (
      <div>
        {
          size(notifications.allIds)
            ? (
              notifications.allIds.map(id => (
                <Snackbar
                  className={classes.container}
                  // contentStyle={{ color: colors.white, backgroundColor: colors.capeCod }}
                  // bodyStyle={{ backgroundColor: colors.capeCod, paddingRight: 0 }}
                  key={id}
                  open
                  action={<CloseIcon color='white' style={closeIconStyle} />}
                  onActionTouchTap={() => dismissNotification(id)}
                  message={notifications.byId[id].message}
                />
              ))
            )
            : null
        }
      </div>
    )
  }
}
