import React from 'react'
import { ProviderDataForm } from 'routes/Account/components/ProviderDataForm/ProviderDataForm'
import { shallow } from 'enzyme'

describe.skip('(Account:Component) ProviderDataForm', () => {
  let _component
  const providerData = [{displayName: 'asdf'}]

  beforeEach(() => {
    _component = shallow(
      <ProviderDataForm providerData={providerData} />
    )
  })

  it('Renders', () => {
    const form = _component.find('div')
    expect(form).to.exist
  })

})
