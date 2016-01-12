import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import AutoComplete from 'material-ui/lib/auto-complete';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';
import Avatar from 'material-ui/lib/avatar';
import FileFolder from 'material-ui/lib/svg-icons/file/folder';
import './SharingDialog.scss';

class SharingDialog extends Component {
  constructor(props){
    super(props);
  }

  state = {
    autocompleteField: ''
  };

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
        className="SharingDialog"
        actions={ actions }
        modal={false}
        open={ this.props.modalOpen }
        onRequestClose={ this.props.toggleModal }
        bodyClassName="SharingDialog-Settings"
        titleClassName="SharingDialog-Settings-Title"
        contentStyle={{'width': '30%'}}
        >
          <List subheader="Folders" insetSubheader={true}>
            <ListItem
              leftAvatar={<Avatar icon={<FileFolder />} />}
              rightIcon={<ActionInfo />}
              primaryText="Scott Prue"
              secondaryText="Read, Write" />
            <ListItem
              leftAvatar={<Avatar icon={<FileFolder />} />}
              rightIcon={<ActionInfo />}
              primaryText="Mel van Londen"
              secondaryText="Read, Write" />
            <ListItem
              leftAvatar={<Avatar icon={<FileFolder />} />}
              rightIcon={<ActionInfo />}
              primaryText="John Cusak"
              secondaryText="Read" />
          </List>
          <AutoComplete
            hintText="Add collaborator"
            dataSource={ this.state.autocompleteField }
            onUpdateInput={ this.handleAutoCompleteChange }
            onNewRequest={ this.handleAutoCompleteSubmit }
          />
      </Dialog>
    );
  }
}

export default SharingDialog
