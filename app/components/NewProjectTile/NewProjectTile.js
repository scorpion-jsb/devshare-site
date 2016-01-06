import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import './NewProjectTile.scss';

export default class NewProjectTile extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <Paper key={`Project-New`} className="NewProjectTile">
        <FontIcon className="material-icons" style={{fontSize: '3rem'}}>add-circle</FontIcon>
        <IconButton iconClassName="material-icons-custom-github" tooltip="bottom-right"
        tooltipPosition="bottom-right" />
      </Paper>
    );
  }
}
