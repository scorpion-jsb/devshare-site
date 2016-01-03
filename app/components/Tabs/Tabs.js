import React, { PropTypes, Component } from 'react';
import Tab from '../Tab/Tab';

import './Tabs.scss';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  static propTypes = {
    currentIndex: PropTypes.number,
    list: PropTypes.array,
    onSelect: PropTypes.func,
    onClose: PropTypes.func
  };
  handleClose(ind){
    if(this.props && this.props.onClose){
      this.props.onClose(ind);
    }
  }
  handleSelect(ind){
    if(this.props && this.props.onSelect){
      this.props.onSelect(ind);
    }
  }
  render() {
    let tabs = [];
    if(this.props && this.props.list){
      tabs = this.props.list.map((tab, i) => {
        return (
          <Tab
            key={ `Tab-${i}` }
            index={ i }
            title={ tab.title || tab.name || 'unamed file'}
            active={ this.props.currentIndex === i }
            onSelect={ this.handleSelect }
            onClose={ this.handleClose }
          />
        );
      });
    }
    return (
      <ul className="Tabs">
        { tabs }
      </ul>
    );
  }
}


export default Tabs;
