import React, { PropTypes, Component } from 'react';

import './Pane.scss';

import Tabs from '../Tabs';
import Views from '../Views';

class Pane extends Component {
  constructor() {
    super();
    this.closeTab = this.closeTab.bind(this);
    this.selectTab = this.selectTab.bind(this);
  }
  static propTypes = {
    tabs: PropTypes.object,
    onTabSelect: PropTypes.func.isRequired,
    onTabClose: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
  };
  closeTab(ind){
    this.props.onTabClose(ind);
  }
  selectTab(ind){
    this.props.onTabSelect(ind);
  }
  render() {
    console.log('project in pane, no game', this.props.project);
    return (
      <div className="Pane">
        <Tabs
          list={ this.props.tabs.list }
          currentIndex={ this.props.tabs.currentIndex }
          onClose={ this.closeTab }
          onSelect={ this.selectTab }
        />
        <Views
          views={ this.props.tabs.list }
          currentIndex={ this.props.tabs.currentIndex }
          project={ this.props.project }
          workspace={ this.workspace }
        />
      </div>
    );
  }

}
export default Pane;
