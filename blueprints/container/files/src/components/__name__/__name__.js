import React from 'react'
import classes from './<%= pascalEntityName %>.scss'

export class <%= pascalEntityName %> extends Component {
  render() {
    return (
      <div className={classes['<%= pascalEntityName %>']}>
        <h1><%= pascalEntityName %></h1>
      </div>
    )
  }
}
export default <%= pascalEntityName %>
