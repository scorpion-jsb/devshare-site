import React, {Component, PropTypes} from 'react'
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'
import TextField from 'material-ui/lib/text-field'
import './ProjectSettingsDialog.scss'
import Toggle from 'material-ui/lib/toggle'
import RaisedButton from 'material-ui/lib/raised-button';

export default class ProjectSettingsDialog extends Component {
  constructor(props){
    super(props)
  }

  static propTypes = {
    modalOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    project: PropTypes.object,
    vimEnabled: PropTypes.bool,
    onVimToggle: PropTypes.func
  };

  state = { vimEnabled: this.props.vimEnabled || false };

  handleAutoCompleteSubmit = () => {
    //TODO: Add collaborator
  };

  handleAutoCompleteChange = () => {
    //TODO: handle change
  };

  handleVimToggle = () => {
    if(this.props.onVimToggle) this.props.onVimToggle(this.state.vimEnabled);
    this.setState({
      vimEnabled: !this.state.vimEnabled
    });
  };

  showDelete = () => {
    this.setState({ showDelete: true })
  };

  render () {
    const actions = [
      <FlatButton
        label="Close"
        secondary={ true }
        onTouchTap={ this.props.toggleModal }
      />
    ];
    const owner = (this.props.project && this.props.project.owner && this.props.project.owner.username) ? this.props.project.owner.username : this.props.project.owner;
    return (
      <Dialog
        title="Settings"
        actions={ actions }
        modal={false}
        open={ this.props.modalOpen }
        onRequestClose={ this.props.toggleModal }
        bodyClassName="ProjectSettingsDialog-Settings"
        titleClassName="ProjectSettingsDialog-Settings-Title"
        contentStyle={{'width': '30%'}}
        >
        <TextField
          hintText="Project name"
          floatingLabelText="Project name"
          defaultValue={ this.props.project.name }
        />
        <TextField
          hintText="Owner"
          floatingLabelText="Owner"
          defaultValue={ owner }
          disabled={ true }
        />
        <TextField
          hintText="Site url"
          floatingLabelText="Site url"
          disabled={ true }
        />
        <div>
          {
            this.state.showDelete
            ? <TextField
                hintText="myProject"
                floatingLabelText="project name"
                style={{ color: 'grey'}}
              />
              : null
          }
          <RaisedButton
            label="Delete"
            primary={true}
            onClick={ this.showDelete }
          />
        </div>
      </Dialog>
    );
  }
}
