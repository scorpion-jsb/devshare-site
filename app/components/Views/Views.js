import React, { PropTypes, Component } from 'react';
import View from '../View';
import './Views.scss';

class Views extends Component {
  constructor() {
    super();
  }
  static propTypes = {
    views: PropTypes.array,
    currentIndex: PropTypes.number,
    project: PropTypes.object.isRequired
  };
  
  render() {
    let currentIndex = this.props.currentIndex || 0;
    if (!this.props.views) {
      return (
        <div className="View-Default">
          <span className="View-Default-Label">Click on a file to open</span>
        </div>
      );
    }
    let views = this.props.views.map((view, i) => {
      if (i === currentIndex) {
        return (
          <View
            key={ `{i}-${view.file.path}` }
            index={ i }
            viewData={ view }
            project={ this.props.project }
            visible={ true }
          />
        );
      }
      return (
        <View
          index={ i }
          key={ i }
          viewData={ view }
          project={ this.props.project }
          visible={ false }
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
