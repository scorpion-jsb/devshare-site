import React, {Component, PropTypes} from 'react'
import Dialog from 'material-ui/lib/dialog'
import TextField from 'material-ui/lib/text-field'
import FlatButton from 'material-ui/lib/flat-button'
import './NewProjectDialog.scss'

class NewProjectDialog extends Component {
  constructor(props){
    super(props)
  }

  state = { open: this.props.open || false }

  componentWillReceiveProps (nextProps) {
    console.log('nextprops:', nextProps)
    if (nextProps.open) {
      this.setState({
        open: true
      })
      setTimeout(() => {
        this.refs.projectNameField.focus()
      }, 500)
    }
  }

  handleInputChange = (name, e) => {
    e.preventDefault()
    this.setState({
      [name]: e.target.value,
      error: null
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (!this.state.name) {
      return this.setState({
        error: 'Name is required'
      })
    }
    if(this.props && this.props.onCreateClick){
      this.props.onCreateClick(this.state.name)
      this.close()
    }
  }

  close = () => {
    this.setState({
      open: false
    })
  }

  render () {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={ this.close }
      />,
      <FlatButton
        label="Create"
        primary={true}
        onClick={ this.handleSubmit}
      />
    ]
    return (
      <Dialog
        title="New Project"
        modal={ false }
        actions={ actions }
        open={ this.state.open }
        onRequestClose={ this.close }
        contentClassName='NewProjectDialog'>
        <div className="NewProjectDialog-Inputs">
          <TextField
            hintText="exampleProject"
            floatingLabelText="Project Name"
            ref="projectNameField"
            onChange={ this.handleInputChange.bind(this, 'name') }
            errorText={ this.state.error || null }
          />
        </div>
      </Dialog>
    )
  }
}

export default NewProjectDialog
