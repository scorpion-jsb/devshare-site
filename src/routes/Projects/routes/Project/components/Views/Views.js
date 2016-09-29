import React, { PropTypes, Component } from 'react'
import View from '../View'
import classes from './Views.scss'

export default class Views extends Component {

  static propTypes = {
    views: PropTypes.array,
    currentIndex: PropTypes.number,
    project: PropTypes.object.isRequired
  }

  buildViews = () => {
    const currentIndex = this.props.currentIndex || 0
    const { views, project } = this.props

    return views.map((view, i) => {
      if (i === currentIndex) {
        return (
          <View
            key={`{i}-${view.file.path}`}
            index={i}
            viewData={view}
            project={project}
            visible
          />
        )
      }
      return (
        <View
          index={i}
          key={i}
          viewData={view}
          project={project}
          visible={false}
        />
      )
    })
  }

  render () {
    if (!this.props.views) {
      return (
        <div className={classes['view-default']}>
          <span className={classes['view-default-label']}>
            Click on a file to open
          </span>
        </div>
      )
    }
    const views = this.buildViews()
    return (
      <div className={classes['container']}>
        {views}
      </div>
    )
  }
}
