import React, { PropTypes, Component } from 'react'
import View from '../View'
import './Views.scss'

export default class Views extends Component {
  constructor() {
    super()
  }

  static propTypes = {
    views: PropTypes.array,
    currentIndex: PropTypes.number,
    project: PropTypes.object.isRequired,
    vimEnabled: PropTypes.bool
  }

  buildViews = () => {
    const currentIndex = this.props.currentIndex || 0
    const { views, project, vimEnabled } = this.props
    return views.map((view, i) => {
      if (i === currentIndex) {
        return (
          <View
            key={ `{i}-${view.file.path}` }
            index={ i }
            viewData={ view }
            project={ project }
            visible={ true }
            vimEnabled={ vimEnabled }
          />
        )
      }
      return (
        <View
          index={ i }
          key={ i }
          viewData={ view }
          project={ project }
          visible={ false }
          vimEnabled={ vimEnabled }
        />
      )
    })
  }

  render () {
    if (!this.props.views) {
      return (
        <div className="View-Default">
          <span className="View-Default-Label">Click on a file to open</span>
        </div>
      )
    }
    const views = this.buildViews()
    return (
      <div className="Views">
        { views }
      </div>
    )
  }
}
