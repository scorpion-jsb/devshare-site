import React, { PropTypes } from 'react'
import { map, omit } from 'lodash'
import TreeFolder from '../TreeFolder'
import TreeFile from '../TreeFile'
import classes from './FileStructure.scss'

export const FileStructure = ({ files, onRightClick, onFileClick }) => (
  <ol className={classes.container}>
    {
      map(files, (entry, i) => {
        // no metadata
        if (!entry.meta) {
          const firstChildPath = entry[Object.keys(entry)[0]].meta.path
          const childPathSplit = firstChildPath.split('/')
          entry.meta = {
            entityType: 'folder',
            name: entry.key,
            path: childPathSplit.slice(0, -1).join('/')
          }
        }

        // Folder
        if (entry.meta && (entry.meta.entityType === 'folder')) {
          const children = Object.assign({}, omit(entry, ['key', 'meta']))
          return (
            <TreeFolder
              key={`child-Folder-${i}-${entry.meta.name}`}
              index={i}
              data={entry.meta}
              isCollapsed={entry.isCollapsed}
              children={children}
              onFileClick={onFileClick}
              onRightClick={onRightClick}
            />
          )
        }

        // File
        return (
          <TreeFile
            key={`child-File-${i}-${entry.meta.name || entry.meta.path.split('/')[0]}`}
            index={i}
            data={entry.meta}
            active={entry.active}
            onClick={onFileClick}
            onRightClick={onRightClick}
            users={entry.users}
          />
        )
      })
    }
  </ol>
)

FileStructure.propTypes = {
  files: PropTypes.object,
  onRightClick: PropTypes.func,
  onFileClick: PropTypes.func
}

export default FileStructure
