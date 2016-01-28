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
  componentWillReceiveProps(nextProps) {
    // console.log('next props for views', nextProps);
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
