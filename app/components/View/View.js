import React, { PropTypes, Component } from 'react'
import Editor from '../Editor'
import './View.scss'

export default class View extends Component {

  static propTypes = {
    viewData: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    project: PropTypes.object.isRequired,
    vimEnabled: PropTypes.bool
  }

  render () {
    const style = this.props.visible ? { display: 'block' } : { display: 'none' }
    const name = `editor-${this.props.index}`
    // File loaded in View
    if (this.props.viewData && this.props.viewData.file) {
      // TODO: Switch view type based on provided type instead of availability of editor data
      const { file } = this.props.viewData
      return (
        <div className='View' style={style}>
          <Editor
            key={file.path}
            name={name}
            value={file.content}
            mode={file.fileType || 'javascript'}
            filePath={file.path}
            project={this.props.project}
            vimEnabled={this.props.vimEnabled}
          />
        </div>
      )
    }
    // Empty View
    return (
      <div className='View-Default'>
        <span className='View-Default-Label'>Click on a file to open</span>
      </div>
    )
  }
}
