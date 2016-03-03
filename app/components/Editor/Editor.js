import React, { PropTypes, Component } from 'react';
import './Editor.scss';
import { connect } from 'react-redux';
import Grout from 'kyper-grout';

let grout = new Grout('tessellate', {logLevel: 'trace'});

class Editor extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    mode: PropTypes.string,
    theme: PropTypes.string,
    name: PropTypes.string.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    showGutter: PropTypes.bool,
    value: PropTypes.string,
    maxLines: PropTypes.number,
    readOnly: PropTypes.bool,
    highlightActiveLine: PropTypes.bool,
    showPrintMargin: PropTypes.bool,
    filePath: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    vimEnabled: PropTypes.bool
  };

  static defaultProps = {
    name: 'editor',
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
    var Firepad = require('firepad');
    if(typeof editor.firepad === 'undefined'){
      const file = grout.Project(this.props.project.name, this.props.project.owner.username).File(this.props.filePath);
      try {
        try {
          this.firepad = Firepad.fromCodeMirror(file.fbRef, editor,  {userId: this.props.account.username || '&'});
        } catch(err) {
          console.warn('Error creating firepad', err);
        }
        if(this.firepad){
          this.firepad.on('ready', () => {
            //TODO: Load original content of file
            if(this.firepad.isHistoryEmpty()){
              file.getOriginalContent().then(content => {
                if(content){
                  this.firepad.setText(content);
                }
              });
            }
          });
        }
      } catch(err) {
        console.warn('Load firepad error:', err);
      }
    }
  };

  handleDispose = () => {
    this.firepad.dispose();
    // this.editor.destroy();
  };

  componentWillUnmount() {
    this.handleDispose();
  }

  componentDidMount() {
    var CodeMirror = require('codemirror')
    require('expose?CodeMirror!codemirror'); //Needed for Firepad to load CodeMirror
    require('codemirror/lib/codemirror.css');
    require('codemirror/theme/monokai.css');
    require('codemirror/mode/javascript/javascript');
    require('codemirror/mode/htmlmixed/htmlmixed');
    require('codemirror/keymap/vim');
    const editorDiv = document.getElementById(this.props.name);
    let mode = this.props.mode;
    //TODO: Handle different types
    if(mode === 'html') mode = 'htmlmixed';
    // CodeMirror.Vim.map('jj', '<Esc>', 'insert')
    this.editor = CodeMirror(editorDiv, { lineNumbers: true, mode: `${mode || 'javascript'}`, lineWrapping: true});
    this.editor.setOption('theme', 'monokai');
    // //TODO: add read only for collabs
    // this.editor.setOption('readOnly', this.props.readOnly);
    this.handleLoad(this.editor);
  }

  enableVim = () => {
    this.editor.setOption('keyMap', 'vim')
  };

  disableVim = () => {
    this.editor.setOption('keyMap', 'default')
  };

  componentWillReceiveProps(nextProps) {
    if(this.editor){
      //TODO: Check to see if this is nessesary
      this.handleLoad(this.editor);
      nextProps.vimEnabled ? this.enableVim() : this.disableVim()
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
