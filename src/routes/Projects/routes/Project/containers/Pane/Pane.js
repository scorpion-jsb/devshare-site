import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as TabActions } from '../../modules/tabs'
import Tabs from '../../components/Tabs'
import Views from '../../components/Views'
import classes from './Pane.scss'

@connect(
  null,
  (dispatch) =>
    bindActionCreators(TabActions, dispatch)
)
export default class Pane extends Component {
  static propTypes = {
    tabs: PropTypes.object,
    project: PropTypes.object,
    params: PropTypes.object,
    navigateToTab: PropTypes.func.isRequired,
    closeTab: PropTypes.func.isRequired
  }

  render () {
    const {
      project,
      closeTab,
      navigateToTab,
      tabs: { list, currentIndex }
    } = this.props

    return (
      <div className={classes.container}>
        <Tabs
          list={list}
          currentIndex={currentIndex}
          onClose={(i) => closeTab(project, i)}
          onSelect={(i) => navigateToTab(project, i)}
        />
        <Views
          views={list}
          currentIndex={currentIndex}
          project={project}
          workspace={this.workspace}
        />
      </div>
    )
  }

}
