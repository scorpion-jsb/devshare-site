import { find, map } from 'lodash'
import React, {Component, PropTypes} from 'react'
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import AutoComplete from 'material-ui/lib/auto-complete'
import Avatar from 'material-ui/lib/avatar'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import RemoveIcon from 'material-ui/lib/svg-icons/content/remove-circle'
import Colors from 'material-ui/lib/styles/colors'
import './SharingDialog.scss'

export default class SharingDialog extends Component {
  constructor (props){
    super(props);
  }

  state = {
    matchingUsers: [],
    collaborators: this.props.project.collaborators || []
  };

  static propTypes = {
    project: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    onUserSearch: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onRemoveCollab: PropTypes.func,
    onAddCollab: PropTypes.func
  };

  componentWillReceiveProps (nextProps) {
    this.state.collaborators = nextProps.project.collaborators || [];
  }

  searchAccounts = q => {
    this.props.onUserSearch(q, (err, matchingUsers) => {
      if (!err) this.setState({ matchingUsers })
    })
  };

  selectNewCollab = (username) => {
    const { collaborators } = this.props.project
    if (this.props.onAddCollab) this.props.onAddCollab(username)
    this.setState({ searchText: null })
  };

  removeCollab = ind => {
    console.log('collaborators before remove:', this.state.collaborators)
    const user = this.state.collaborators[ind]
    if(this.props.onRemoveCollab){
      this.props.onRemoveCollab(user.username);
      this.setState({
        collaborators: this.state.collaborators.splice(ind, 1)
      })
    }
  };

  cancelClick = () => {
    this.setState({
      searchText: null
    });
    this.props.toggleModal();
  };

  render(){
    const user = {
      image: {
        url: null
      }
    };
    let collabsList = (this.state.collaborators && this.state.collaborators) ? this.state.collaborators.map((collaborator, i) => {
      return (
        <ListItem
          key={`${this.props.project.name}-Collab-${i}`}
          leftAvatar={
            <Avatar
              icon={ <PersonIcon /> }
              src={ (user.image && user.image.url) ? user.image.url : null }
            />
          }
          rightIcon={
            <RemoveIcon
              color={Colors.red500}
              hoverColor={Colors.red800}
              onClick={ this.removeCollab.bind(this, i) }
            />
          }
          primaryText={ collaborator.username }
          secondaryText="Read, Write"
        />
      )
    }) : null;
    const actions = [
      <FlatButton
        label="Close"
        secondary={ true }
        onTouchTap={ this.cancelClick }
      />
    ];
    let matchingUsernames = this.state.matchingUsers ? this.state.matchingUsers.map(account => {
      return account.username ? account.username : account;
    }) : [];
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
      {
      this.props.project.collaborators ?
        <List>
        { collabsList }
        </List>
        :
        <div className="SharingDialog-No-Collabs">
          <span>No current collaborators</span>
        </div>
      }
        <div className="SharingDialog-AutoComplete-Container">
          <AutoComplete
            className="SharingDialog-Autocomplete"
            hintText="Search users to add"
            floatingLabelText="Search users to add"
            fullWidth={ true }
            searchText={ this.state.searchText }
            dataSource={ matchingUsernames }
            onUpdateInput={ this.searchAccounts }
            onNewRequest={ this.selectNewCollab }
          />
        </div>
      </Dialog>
    );
  }
}
