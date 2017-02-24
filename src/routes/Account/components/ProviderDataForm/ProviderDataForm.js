import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List'
import { map } from 'lodash'
import AccountCircle from 'material-ui/svg-icons/action/account-circle'

export const ProviderDataForm = ({ providerData }) => (
  <List>
    {
      map(providerData, (providerAccount, i) =>
        <ListItem
          key={i}
          primaryText={i}
          leftIcon={<AccountCircle />}
          nestedItems={[
            <ListItem
              key='display_name'
              primaryText={providerAccount.displayName}
            />,
            <ListItem
              key='email'
              label='email'
              primaryText={providerAccount.email}
              disabled
            />
          ]}
        />
      )
    }
  </List>
)

ProviderDataForm.propTypes = {
  providerData: PropTypes.object
}

export default ProviderDataForm
