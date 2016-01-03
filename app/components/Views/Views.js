import React, { PropTypes, Component } from 'react';
import View from '../View';
import './Views.scss';

class Views extends Component {
  constructor() {
    super();
    this.handleLoad = this.handleLoad.bind(this);
  }
  static propTypes = {
    views: PropTypes.array,
    currentIndex: PropTypes.number,
    onActiveLoad: PropTypes.func
  };
  handleLoad(loadedViewData) {
    if(this.props && this.props.onActiveLoad){
      this.props.onActiveLoad(loadedViewData);
    }
  }
  render() {
    let defaultView = {
      title: 'view1',
      type: 'default'
    };
    let viewsArray = (this.props.views && this.props.views.length) ?  this.props.views : [defaultView];
    let currentIndex = this.props.currentIndex || 0;
    let views = viewsArray.map((view, i) => {
      if (i === currentIndex) {
        return <View key={ i } viewData={ view } visible={ true } index={ i } onLoad={ this.handleLoad }/>
      }
      return <View key={ i } viewData={ view } visible={ false } index={ i } />
    });
    return (
      <div className="Views">
        { views }
      </div>
    );
  }
}

export default Views;
