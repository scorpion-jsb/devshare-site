import React, { PropTypes, Component } from 'react';
import Editor from '../Editor';
import './View.scss';

export default class View extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
    viewData: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    project: PropTypes.object.isRequired
  };
  render(){
    // console.log('project in view', this.props.project);
    let style = this.props.visible ? { display: 'block' } : { display: 'none' };
    const name = `ace-editor-${this.props.index}`;
    // TODO: Switch view type based on provided type instead of availability of editor data
    if(this.props.viewData && this.props.viewData.file){
      const { file } = this.props.viewData;
      return (
        <div className="View" style={ style }>
          <Editor
            name={ name }
            value={ file.content }
            mode={ file.fileType || 'javascript' }
            filePath={ file.path }
            project={ this.props.project }
          />
        </div>
      );
    }

    return (
      <div className="View-Default">
        <span className="View-Default-Label">Click on a file to open</span>
      </div>
    );

  }
}
