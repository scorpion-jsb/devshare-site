import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import './ProjectSettingsDialog.scss';

class ProjectSettingsDialog extends Component {
  constructor(props){
    super(props);
  }

  state = {
    settingsOpen: false
  };

  toggleSettingsModal = () => {
    this.setState((state) => {
      return {
        settingsOpen: !state.settingsOpen
      }
    })
  };

  saveSettings = (data) => {
    this.props.updateProject({project: this.props.project, data});
    //TODO: Show popup of save success/failure
    this.toggleSettingsModal();
  };

  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={ this.toggleSettingsModal }
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
        open={ this.state.settingsOpen }
        onRequestClose={ this.toggleSettingsModal }
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
