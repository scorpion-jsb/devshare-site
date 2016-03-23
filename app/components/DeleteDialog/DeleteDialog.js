import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field'

import './DeleteDialog.scss'

export default class DeleteDialog extends Component {
  constructor (props) {
    super(props)
  }

  state = { open: this.props.open || false }

  static propTypes = {
    name: PropTypes.string.isRequired,
    open: PropTypes.bool,
    onSubmit: PropTypes.func
  }


  componentWillReceiveProps (nextProps) {
    let nextState = {}
    if (nextProps && typeof nextProps.open !== 'undefined') nextState.open = nextProps.open
    this.setState(nextState)
  }

  open = () => {
    this.setState({
      open: false
    })
  }

  close = () => {
    this.setState({
      open: false
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.props.onSubmit) this.props.onSubmit(name)
    this.close()
  }

  handleInputChange = (name, e) => {
    e.preventDefault()
    this.setState({
      [name]: e.target.value
    })
  }


  render () {
    const { name } = this.props
    const deleteActions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={ this.close }
      />,
      <FlatButton
        label="Delete"
        primary={true}
        keyboardFocused={true}
        onTouchTap={ this.handleSubmit }
        disabled={ !this.state.projectname || this.state.projectname !== this.props.name }
      />
   ]
    return (
      <div className='DeleteDialog'>
        <Dialog
          title={ `Delete ${name}` }
          onRequestClose={ this.close }
          open={ this.state.open || false }
          actions={ deleteActions }
          modal={ false } >
          <div className='DeleteDialog-Content'>
            <div className='DeleteDialog-Section'>
              <h3 className='DeleteDialog-Warning'>WARNING: </h3>
              <span>This is a permenant action</span>
            </div>
            <div className='DeleteDialog-Question'>
              <span>Are you sure this is what you want to be doing?</span>
            </div>
            <div className='DeleteDialog-Restatement'>
              <span>You are about to delete your project named <span className='DeleteDialog-Restatement-Name'>{ name }</span></span>
            </div>
            <div className='DeleteDialog-InputGroup'>
              <span>Please type in the name of the project to confirm:</span>
              <TextField
                className='DeleteDialog-Input'
                floatingLabelText="Project Name"
                onChange={ this.handleInputChange.bind(this, 'projectname') }
              />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
