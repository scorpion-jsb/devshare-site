import React, { PropTypes, Component } from 'react'
import Editor from '../Editor'
import classes from './View.scss'

export default class View extends Component {

  static propTypes = {
    viewData: PropTypes.shape({
      file: PropTypes.object
    }),
    visible: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    project: PropTypes.object.isRequired
  }

  render () {
    const { visible, viewData, index } = this.props
    const style = visible ? { display: 'block' } : { display: 'none' }
    const name = `editor-${index}`

    // File loaded in View
    if (viewData && viewData.file) {
      // TODO: Switch view type based on provided type instead of availability of editor data
      const { file } = viewData
      return (
        <div className={classes['container']} style={style}>
          <Editor
            key={file.path}
            name={name}
            value={file.content}
            mode={file.fileType || 'javascript'}
            filePath={file.path}
            project={this.props.project}
          />
        </div>
      )
    }
    // Empty View
    return (
      <div className={classes['default']}>
        <span className={classes['default-label']}>
          Empty View
        </span>
      </div>
    )
  }
}
