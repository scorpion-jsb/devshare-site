import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { Actions } from 'redux-grout';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import './Account.scss';

class Account extends Component {
  constructor(props){
    super(props);
  }
  state = {};
  handleLogout = () => {
    this.props.logout();
    this.props.history.pushState(null, '/');
  };
  handleSave = () => {
    // this.props.saveAccount();
  };
  onFileDrop = (files) => {
    console.warn('file dropped', files);
    this.setState({
      imageFile: files[0]
    });
  };
  render(){
    return (
      <div className="Account">
      { this.state.imageFile ?
        <AvatarEditor
          image={ this.state.imageFile.preview }
          width={350}
          height={350}
          border={10}
        scale={1} /> :
        <Dropzone  onDrop={ this.onFileDrop } multiple={ false }>
          <div className="Account-DropText">
            Drag to Upload <br/> Profile Image
          </div>
        </Dropzone>
        }
        <div className="Account-Data">
          <TextField
            hintText="Username"
            floatingLabelText="Username"
            defaultValue={ this.props.account.username }
          />
          <TextField
            hintText="Email"
            floatingLabelText="Email"
            defaultValue={ this.props.account.email || 'No Email' }
          />
        </div>
        <div className="Account-Buttons">
          <RaisedButton
            primary={true}
            label="Save"
            disabled={ this.state.imageFile }
            onClick={ this.handleSave }
          />
          <RaisedButton
            style={{'marginTop': '1rem'}}
            label="Logout"
            onClick={ this.handleLogout }
          />
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
