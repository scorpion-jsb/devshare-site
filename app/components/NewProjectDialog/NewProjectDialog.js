import React, {Component, PropTypes} from 'react';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import './NewProjectDialog.scss';

class NewProjectDialog extends Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  /**
  * @function handleInputChange
  * @description Update the state with the values from the form inputs.
  * @fires context#setState
  */
 handleInputChange(name, e) {
   e.preventDefault();
   this.setState({
     [name]: e.target.value
   });
 }
  handleSubmit(e) {
    e.preventDefault();
    if(this.props && this.props.onCreateClick){
      this.props.onCreateClick(this.state.name);
      this.props.onRequestClose();
    }
  }
  render(){
    return (
      <Dialog
        className="NewProjectDialog"
        title="New Project"
        modal={false}
        open={ this.props.open }
        onRequestClose={ this.props.onRequestClose }>
        <div className="NewProjectDialog-Inputs">
          <TextField
            hintText="exampleProject"
            floatingLabelText="Project Name"
            onChange={  this.handleInputChange.bind(this, 'name')}
          />
        </div>
        <div className="NewProjectDialog-Buttons">
          <FlatButton label="Create" primary={true} onClick={ this.handleSubmit }/>
        </div>
      </Dialog>
    );
  }
}

export default NewProjectDialog
