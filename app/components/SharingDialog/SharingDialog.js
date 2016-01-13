import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import AutoComplete from 'material-ui/lib/auto-complete';
import Avatar from 'material-ui/lib/avatar';
import PersonIcon from 'material-ui/lib/svg-icons/social/person';
import RemoveIcon from 'material-ui/lib/svg-icons/content/remove-circle';
import Colors from 'material-ui/lib/styles/colors';
import './SharingDialog.scss';

const stockPhotoUrl = 'https://s3.amazonaws.com/kyper-cdn/img/User.png';

class SharingDialog extends Component {
  constructor(props){
    super(props);
  }

  state = {
    autocompleteField: []
  };

  static propTypes = {
    modalOpen: PropTypes.bool,
    toggleModal: PropTypes.func
  };

  render(){
    const user = {
      image: {
        url: null
      }
    };
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
        title="Sharing"
        className="SharingDialog"
        actions={ actions }
        modal={false}
        open={ this.props.modalOpen }
        onRequestClose={ this.props.toggleModal }
        bodyClassName="SharingDialog-Content"
        titleClassName="SharingDialog-Content-Title"
        contentStyle={{'width': '30%'}}
        >
          <List>
            <ListItem
              leftAvatar={<Avatar
                icon={ <PersonIcon /> }
                src={ (user.image && user.image.url) ? user.image.url : null }
              />}
              rightIcon={<RemoveIcon color={Colors.red500} hoverColor={Colors.red800} />}
              primaryText="Scott Prue"
              secondaryText="Read, Write" />
            <ListItem
              leftAvatar={<Avatar
                icon={ <PersonIcon /> }
                src={ (user.image && user.image.url) ? user.image.url : null }
              />}
              rightIcon={<RemoveIcon color={Colors.red500} hoverColor={Colors.red800} />}
              primaryText="Mel van Londen"
              secondaryText="Read, Write" />
            <ListItem
              leftAvatar={<Avatar
                icon={ <PersonIcon /> }
                src={ (user.image && user.image.url) ? user.image.url : null }
              />}
              rightIcon={<RemoveIcon color={Colors.red500} hoverColor={Colors.red800} />}
              primaryText="John Cusak"
              secondaryText="Read" />
          </List>
          <div className="SharingDialog-AutoComplete-Container">
            <AutoComplete
              className="SharingDialog-Autocomplete"
              hintText="Add collaborator"
              fullWidth={true}
              dataSource={ this.state.autocompleteField }
              onUpdateInput={ this.handleAutoCompleteChange }
              onNewRequest={ this.handleAutoCompleteSubmit }
            />
        </div>
      </Dialog>
    );
  }
}

export default SharingDialog
