import React, { PropTypes, Component } from 'react';
import './Editor.scss';
import { connect } from 'react-redux';
import Grout from 'kyper-grout';

let grout = new Grout();

class Editor extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    mode: PropTypes.string,
    theme: PropTypes.string,
    name: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string,
    fontSize: PropTypes.number,
    showGutter: PropTypes.bool,
    value: PropTypes.string,
    maxLines: PropTypes.number,
    readOnly: PropTypes.bool,
    highlightActiveLine: PropTypes.bool,
    showPrintMargin: PropTypes.bool,
    filePath: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired
  };

  static defaultProps = {
    name: 'brace-editor',
    mode: 'javascript',
    theme: 'monokai',
    value: '',
    fontSize: 12,
    showGutter: true,
    maxLines: null,
    readOnly: false,
    highlightActiveLine: true,
    showPrintMargin: true
  };

  firepad = {};

  handleLoad = (editor) => {
    //Load file content
    if(typeof editor.firepad === 'undefined'){
      let fbRef = grout.Project(this.props.project.name, this.props.project.owner.username).File(this.props.filePath).fbRef;
      try {
        this.firepad = createFirepad(fbRef, editor, {userId: this.props.account.username || '&'});
        this.firepad.on('ready', () => {
          //TODO: Load original content of file
          // if(firepad.isHistoryEmpty()){
          //   file.get().then(fileRes => {
          //     if(fileRes.content){
          //       firepad.setText(fileRes.content);
          //     }
          //   });
          // }
        });
      } catch(err) {
        console.warn('Load firepad error:', err);
      }
    }
  };

  handleDispose = () => {
    console.log('disposing of firepad', this.firepad);
    console.log('disposing of editor', this.editor);
    this.firepad.dispose();
    this.editor.destroy();
  };

  componentWillUnmount() {
    this.handleDispose();
  }

  componentDidMount() {
    // require('brace/mode/javascript');
    // require('brace/theme/monokai');
    this.editor = createAce(this.props.name);
    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode(`ace/mode/${this.props.mode}`);
    this.editor.setTheme('ace/theme/'+this.props.theme);
    this.editor.setFontSize(this.props.fontSize);
    this.editor.renderer.setShowGutter(this.props.showGutter);
    this.editor.setOption('maxLines', this.props.maxLines);
    this.editor.setOption('readOnly', this.props.readOnly);
    this.editor.setOption('highlightActiveLine', this.props.highlightActiveLine);
    this.editor.setShowPrintMargin(this.props.setShowPrintMargin);
    this.handleLoad(this.editor);
  }

  componentWillReceiveProps(nextProps) {
    if(this.editor){
      this.editor.getSession().setMode(`ace/mode/${nextProps.mode}`);
      this.editor.setTheme('ace/theme/'+nextProps.theme);
      this.editor.setFontSize(nextProps.fontSize);
      this.editor.setOption('maxLines', nextProps.maxLines);
      this.editor.setOption('readOnly', nextProps.readOnly);
      this.editor.setOption('highlightActiveLine', nextProps.highlightActiveLine);
      this.handleLoad(this.editor);
    }
  }

  render() {
    return (
      <div className="Editor" id={ this.props.name }></div>
    );
  }
}

//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    account: state.account
  };
}

export default connect(mapStateToProps, {})(Editor);
