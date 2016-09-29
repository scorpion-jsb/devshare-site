import React from 'react'
import { AccountForm } from 'routes/Account/components/AccountForm/AccountForm'
import { shallow } from 'enzyme'

describe('(Account:Component) AccountForm', () => {
  let _component
  const account = { username: 'tester', providerData: [{displayName: 'asdf'}] }

  beforeEach(() => {
    _component = shallow(<AccountForm account={account} />)
  })

  it('Renders', () => {
    const form = _component.find('div')
    expect(form).to.exist
  })

})
