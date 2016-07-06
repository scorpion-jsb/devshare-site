import React, {Component, PropTypes} from 'react'
import Paper from 'material-ui/lib/paper'
import ContentAddCircle from 'material-ui/lib/svg-icons/content/add-circle'

import './NewProjectTile.scss'

const iconSize = '6rem'
const iconStyle = { width: iconSize, height: iconSize }
const color = '#979797'
const hoverColor = '#616161'

export default class NewProjectTile extends Component {

  static propTypes = {
    onClick: PropTypes.func
  }

  render () {
    return (
      <Paper className='ProjectTile NewProjectTile' onClick={this.props.onClick}>
        <ContentAddCircle
          color={color}
          hoverColor={hoverColor}
          style={iconStyle}
        />
      </Paper>
    )
  }
}
