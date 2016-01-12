import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
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
        <Tabs>
          <Tab label="General" >
            <div>
              <TextField hintText="Project Name" />
              <TextField hintText="Owner" />
              <TextField hintText="Project Url" />
              <TextField hintText="Git Url" />
              <h2>Tab One Template Example</h2>
              <p>
                This is an example of a tab template!
              </p>
              <p>
                You can put any sort of HTML or react component in here. It even keeps the component state!
              </p>
            </div>
          </Tab>
          <Tab label="Collaborators" >
            <div>
              <h2>Tab Two Template Example</h2>
              <p>
                This is another example of a tab template!
              </p>
            </div>
          </Tab>
          <Tab label="Deployment">
            <p>
              Deployment
            </p>
          </Tab>
        </Tabs>
      </Dialog>
    );
  }
}

export default ProjectSettingsDialog
