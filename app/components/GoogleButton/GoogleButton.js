import React, {Component, PropTypes} from 'react';
import './GoogleButton.scss';

export default class GoogleButton extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
    onClick: PropTypes.func
  };
  render(){
    let { onClick, ...other } = this.props;
    return (
      <div className="GoogleButton" { ...other } onClick={ this.props.onClick }>

      </div>
    );
  }
}
