import React, {Component, PropTypes} from 'react';
import './GoogleButton.scss';

class GoogleButton extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
    onClick: PropTypes.func
  };
  render(){
    return (
      <div className="GoogleButton" onClick={ this.props.onClick }>

      </div>
    );
  }
}

export default GoogleButton
