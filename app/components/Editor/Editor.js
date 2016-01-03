import React, { PropTypes, Component } from 'react';
import './Editor.scss';

export default class Editor extends Component {
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
    showPrintMargin: PropTypes.bool
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
    if (this.props.onLoad) {
      this.props.onLoad(this.editor);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.editor){
      this.editor.getSession().setMode(`ace/mode/${nextProps.mode}`);
      this.editor.setTheme('ace/theme/'+nextProps.theme);
      this.editor.setFontSize(nextProps.fontSize);
      this.editor.setOption('maxLines', nextProps.maxLines);
      this.editor.setOption('readOnly', nextProps.readOnly);
      this.editor.setOption('highlightActiveLine', nextProps.highlightActiveLine);
      if (nextProps.onLoad) {
        nextProps.onLoad(this.editor);
      }
    }
  }
  render() {
    return (
      <div className="Editor" id={ this.props.name }></div>
    );
  }
}
