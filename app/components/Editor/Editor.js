import React, { PropTypes, Component } from 'react';
import './Editor.scss';
import { connect } from 'react-redux';
import Grout from 'kyper-grout';
import CodeMirror from 'codemirror';
import 'expose?CodeMirror!codemirror'; //Needed for Firepad to load CodeMirror
import Firepad from 'firepad';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
// import 'codemirror/mode/javascript/javascript.js';
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
    project: PropTypes.object.isRequired
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
    if(typeof editor.firepad === 'undefined'){
      let file = grout.Project(this.props.project.name, this.props.project.owner.username).File(this.props.filePath);
      let fbRef = file.fbRef;
      try {
        // this.firepad = createFirepad(fbRef.push(), editor, {userId: this.props.account.username || '&'});
        try {
          this.firepad = Firepad.fromCodeMirror(fbRef, editor,  {userId: this.props.account.username || '&'});
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
    const editorDiv = document.getElementById(this.props.name);
    this.editor = CodeMirror(editorDiv, { lineNumbers: true, mode: 'javascript', lineWrapping: true });
    this.editor.setOption('theme', 'monokai');
    // this.editor = createAce(this.props.name);
    // this.editor.setTheme('ace/theme/monokai');
    // this.editor.getSession().setMode(`ace/mode/${this.props.mode}`);
    // this.editor.setTheme('ace/theme/'+this.props.theme);
    // this.editor.renderer.setShowGutter(this.props.showGutter);
    // this.editor.setAutoScrollEditorIntoView(true);
    // this.editor.setOptions({
    //   fontFamily: 'Roboto Mono',
    //   fontSize: '16px',
    // });
    // this.editor.setOption('maxLines', this.props.maxLines);
    // //TODO: add read only for collabs
    // this.editor.setOption('readOnly', this.props.readOnly);
    // this.editor.setOption('highlightActiveLine', this.props.highlightActiveLine);
    // this.editor.setShowPrintMargin(this.props.setShowPrintMargin);
    this.handleLoad(this.editor);
  }

  componentWillReceiveProps(nextProps) {
    if(this.editor){
      // this.editor.getSession().setMode(`ace/mode/${nextProps.mode}`);
      // this.editor.setTheme('ace/theme/'+nextProps.theme);
      // this.editor.setOption('maxLines', nextProps.maxLines);
      // this.editor.setOption('readOnly', nextProps.readOnly);
      // this.editor.setOption('highlightActiveLine', nextProps.highlightActiveLine);
      // this.handleLoad(this.editor);
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
