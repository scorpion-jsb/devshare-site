import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import './AccountDialog.scss';

export default class AccountDialog extends Component {
  constructor(props){
    super(props);
  }
  state = { imageFile: null };
  static propTypes = {
    modalOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    onSave: PropTypes.func
  };

  onFileDrop = (files) => {
    console.warn('file dropped', files);
    this.setState({
      imageFile: files[0]
    });
  };

  save = () => {
    if(this.props.onSave){
      this.props.onSave(this.state.imageFile);
    }
    this.props.toggleModal();
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
        onTouchTap={ this.save }
      />
    ];
    return (
      <Dialog
        title="User Avatar"
        actions={ actions }
        modal={false}
        open={ this.props.modalOpen }
        onRequestClose={ this.props.toggleModal }
        bodyClassName="AccountDialog-Settings"
        titleClassName="AccountDialog-Settings-Title"
        contentStyle={{'width': '30%'}}
        >
        <div className="AccountDialog-Content">
          { this.state.imageFile ?
            <AvatarEditor
              image={ this.state.imageFile.preview }
              width={350}
              height={350}
              border={10}
            scale={1} /> :
            <Dropzone onDrop={ this.onFileDrop } multiple={ false }>
              <div className="Account-Avatar-New-DropText">
                Drag or Click <br/> to Upload <br/> Image
              </div>
            </Dropzone>
          }
        </div>
      </Dialog>
    );
  }
}
