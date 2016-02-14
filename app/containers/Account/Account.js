import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';
import AvatarEditor from 'react-avatar-editor';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import AccountDialog from '../../components/AccountDialog/AccountDialog';
import './Account.scss';
const defaultUserImageUrl = 'https://s3.amazonaws.com/kyper-cdn/img/User.png';

class Account extends Component {
  constructor(props){
    super(props);
  }

  state = { modalOpen: false };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  handleLogout = () => {
    this.props.logout();
    this.context.router.push('/');
  };

  handleSave = () => {
    //TODO: Handle saving image and account data at the same time
    let account = {
      name: this.refs.name.getValue(),
      email: this.refs.email.getValue()
    }
    this.props.updateAccount(account);
  };

  handleAvatarUpload = (imageFile) => {
    console.log('calling upload avatar with:', imageFile);
    this.props.uploadAvatar(imageFile);
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  render(){
    const buttonStyle = {'marginTop': '2rem', width: '20%'};
    const textFieldStyle = {width: '60%'};
    return (
      <div className="Account">
        <AccountDialog
          modalOpen={ this.state.modalOpen }
          toggleModal={ this.toggleModal }
          onSave={ this.handleAvatarUpload }
        />
        <div className="Account-Settings">
          <div className="Account-Avatar">
            <img
              className="Account-Avatar-Current"
              src={ this.props.account.avatar_url || defaultUserImageUrl }
              onClick={ this.toggleModal }
            />
          </div>
          <div className="Account-Meta">
            <TextField
              hintText="Email"
              floatingLabelText="Email"
              ref="email"
              defaultValue={ this.props.account.email || 'No Email' }
              style={ textFieldStyle }
            />
            <RaisedButton
              primary={true}
              label="Save"
              onClick={ this.handleSave }
              style={ buttonStyle }
            />
            <RaisedButton
            style={{'marginTop': '1rem'}}
            label="Logout"
            onClick={ this.handleLogout }
            style={ buttonStyle }
            />
          </div>
        </div>
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions.account, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Account);
