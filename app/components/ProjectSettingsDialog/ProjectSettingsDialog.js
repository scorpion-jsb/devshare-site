import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import './ProjectSettingsDialog.scss';

export default class ProjectSettingsDialog extends Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    modalOpen: PropTypes.bool,
    toggleModal: PropTypes.func
  };

  handleAutoCompleteSubmit = () => {
    //TODO: Add collaborator
  };

  handleAutoCompleteChange = () => {
    //TODO: handle change
  };

  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={ this.props.toggleModal }
      />,
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onTouchTap={ this.saveSettings }
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
      </Dialog>
    );
  }
}
