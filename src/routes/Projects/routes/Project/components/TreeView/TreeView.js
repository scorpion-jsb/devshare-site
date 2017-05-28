import React, { PropTypes } from 'react'
import { isEmpty } from 'react-redux-firebase'
import FileStructure from '../../components/FileStructure'
import classes from './TreeView.scss'

export const TreeView = ({ files, onRightClick, onFileClick }) => (
  <div className={classes.container}>
    <div className={classes.wrapper}>
      {
        !isEmpty(files)
          ? (
            <FileStructure
              files={files}
              onFileClick={onFileClick}
              onRightClick={onRightClick}
            />
            )
          : (
            <div className={classes.none}>
              <div className={classes.emptyDesktop}>
                <span>
                  <strong>Right click</strong>
                </span>
                <span>OR</span>
                <strong>Drop files</strong>
                <span>to get started</span>
              </div>
              <div className={classes.emptyMobile}>
                <span>Touch the Plus to get started</span>
              </div>
            </div>
            )
      }
    </div>
  </div>
)

TreeView.propTypes = {
  files: PropTypes.object,
  onFileClick: PropTypes.func.isRequired,
  onRightClick: PropTypes.func.isRequired
}

export default TreeView
