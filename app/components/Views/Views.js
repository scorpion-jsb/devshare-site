import React, { PropTypes, Component } from 'react';
import View from '../View';
import './Views.scss';

class Views extends Component {
  constructor() {
    super();
    this.handleLoad = this.handleLoad.bind(this);
    this.handleUnload = this.handleUnload.bind(this);
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
  handleUnload(unloadData) {
    console.log('handle unload called ', unloadData);
    if(this.props && this.props.onActiveLoad){
      this.props.onUnload(unloadData);
    }
  }
  render() {
    const defaultView = {
      title: 'view1',
      type: 'default'
    };
    let viewsArray = (this.props.views && this.props.views.length) ?  this.props.views : [defaultView];
    let currentIndex = this.props.currentIndex || 0;
    let views = viewsArray.map((view, i) => {
      if (i === currentIndex) {
        return (
          <View
            key={ i }
            index={ i }
            viewData={ view }
            visible={ true }
            onLoad={ this.handleLoad }
          />
        );
      }
      return (
        <View
          index={ i }
          key={ i }
          viewData={ view }
          visible={ false }
          onLoad={ this.handleUnload }
        />
      );
    });
    return (
      <div className="Views">
        { views }
      </div>
    );
  }
}

export default Views;
