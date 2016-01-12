import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import './ProjectSettingsDialog.scss';

class ProjectSettingsDialog extends Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    modalOpen: PropTypes.bool,
    toggleModal: PropTypes.func
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
    return (
      <Dialog
        title="Settings"
        className="ProjectSettingsDialog"
        actions={ actions }
        modal={false}
        open={ this.props.modalOpen }
        onRequestClose={ this.props.toggleModal }
        bodyClassName="ProjectSettingsDialog-Settings"
        titleClassName="ProjectSettingsDialog-Settings-Title"
        contentStyle={{'width': '30%'}}
        >
        <TextField hintText="Project Name" />
        <TextField hintText="Owner" />
        <TextField hintText="Project Url" />
        <TextField hintText="Git Url" />
      </Dialog>
    );
  }
}

export default ProjectSettingsDialog
