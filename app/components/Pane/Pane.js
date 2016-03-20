import React, { PropTypes, Component } from 'react'
import Tabs from '../Tabs'
import Views from '../Views'
import './Pane.scss'

export default class Pane extends Component {
  constructor () {
    super()
  }
  
  static propTypes = {
    tabs: PropTypes.object,
    project: PropTypes.object.isRequired,
    onTabSelect: PropTypes.func.isRequired,
    onTabClose: PropTypes.func.isRequired,
    vimEnabled: PropTypes.bool
  };

  closeTab = (ind) => {
    this.props.onTabClose(ind);
  };

  selectTab = (ind) => {
    this.props.onTabSelect(ind);
  };

  render () {
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
          vimEnabled={ this.props.vimEnabled }
        />
      </div>
    );
  }

}
